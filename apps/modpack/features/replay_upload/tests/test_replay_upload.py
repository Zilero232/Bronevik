# -*- coding: utf-8 -*-
import io
import json
import os
import re
import shutil
import struct
import tempfile
import threading
import time
import unittest

import _support
from otmetki.core import signing
from otmetki.features.replay_upload import model as replay_upload
from otmetki.companion.binding import Credentials
from otmetki.companion.config import FEATURES, OPT_IN_FEATURES, Config
from otmetki.companion.i18n import Translator
from otmetki.features.replay_upload.model import (OUTCOME_AUTH, OUTCOME_DONE, OUTCOME_DROP, OUTCOME_QUOTA, OUTCOME_RETRY, OUTCOME_WAIT, RESULT_BUSY,
                                   RESULT_ERROR, RESULT_HTTP, RESULT_MISSING, RESULT_TOO_LARGE, ReplayQueue, ReplayUploader,
                                   classify_upload, upload_job)
from otmetki.features.replay_upload.files import (EXTENSIONS, FILE_FIELD, MAGIC, MATCH_WINDOW_S, MAX_BYTES, UPLOAD_PATH, VISIBILITY_HEADER,
                             VISIBILITY_PRIVATE, VISIBILITY_PUBLIC, build_multipart, find_replay,
                             is_replay_name, matches, parse_date_time, read_header, read_header_from, upload_name)
from otmetki.companion.settings_template import build_template, settings_to_config
from otmetki.core.signing import (NONCE_HEADER, SERVER_TIME_HEADER, STALE_REQUEST_STATUS, TIMESTAMP_HEADER, verify_request)
from otmetki.core.storage import JsonFile, MemoryFile
from otmetki.core.transport import BackgroundRunner

ACCOUNT = 12345
OTHER = 777
ARENA = 4512345678901234567
URL = 'https://api.example' + UPLOAD_PATH
SIGNED = (VISIBILITY_HEADER,)
SECRET = 's' * 40
STARTED = 1790000000.0


def local_stamp(epoch):
    return time.strftime('%d.%m.%Y %H:%M:%S', time.localtime(epoch))


def replay_bytes(player_id=ACCOUNT, arena_unique_id=ARENA, started=STARTED, stream=b'\x00' * 64):
    arena = {'playerID': player_id, 'dateTime': local_stamp(started), 'mapName': '14_siegfried_line'}
    blocks = [json.dumps(arena).encode('utf-8')]
    if arena_unique_id is not None:
        results = [{'arenaUniqueID': arena_unique_id, 'personal': {}}, {}, {}]
        blocks.append(json.dumps(results).encode('utf-8'))
    data = struct.pack('<II', MAGIC, len(blocks))
    for block in blocks:
        data += struct.pack('<I', len(block)) + block
    return data + stream


def creds():
    return Credentials('dev-1', SECRET, ACCOUNT)


class SyncFakeTransport(object):
    """Answers inside request(), like transport.SyncTransport."""

    def __init__(self, *responses):
        self.responses = list(responses)
        self.requests = []

    def request(self, method, url, headers, body, callback):
        self.requests.append({'method': method, 'url': url, 'headers': headers, 'body': body})
        status, response_body, response_headers = self.responses.pop(0) if self.responses else (201, b'{}', {})
        callback(status, response_body, response_headers)


class InlineRunner(object):

    def __init__(self):
        self.pending = []

    def submit(self, job, callback):
        self.pending.append((job, callback))

    def poll(self):
        handled = 0
        while self.pending:
            job, callback = self.pending.pop(0)
            callback(job())
            handled += 1
        return handled


class ReplayHeaderTest(unittest.TestCase):

    def test_reads_player_arena_and_start(self):
        header = read_header_from(io.BytesIO(replay_bytes()))
        self.assertEqual(header['player_id'], ACCOUNT)
        self.assertEqual(header['arena_unique_id'], str(ARENA))
        self.assertAlmostEqual(header['date_time'], STARTED, delta=1)

    def test_replay_without_results_block(self):
        header = read_header_from(io.BytesIO(replay_bytes(arena_unique_id=None)))
        self.assertIsNone(header['arena_unique_id'])
        self.assertEqual(header['player_id'], ACCOUNT)

    def test_rejects_garbage(self):
        self.assertIsNone(read_header_from(io.BytesIO(b'PK\x03\x04' + b'\x00' * 20)))
        self.assertIsNone(read_header_from(io.BytesIO(b'')))
        truncated = replay_bytes()[:20]
        self.assertIsNone(read_header_from(io.BytesIO(truncated)))
        self.assertIsNone(read_header(os.path.join(tempfile.gettempdir(), 'otmetki-no-such.wotreplay')))

    def test_date_time(self):
        self.assertAlmostEqual(parse_date_time(local_stamp(STARTED)), STARTED, delta=1)
        self.assertIsNone(parse_date_time('yesterday'))
        self.assertIsNone(parse_date_time(None))

    def test_matches_only_own_battle(self):
        own = {'player_id': ACCOUNT, 'arena_unique_id': str(ARENA), 'date_time': STARTED}
        self.assertTrue(matches(own, ACCOUNT, ARENA, None))
        self.assertFalse(matches(own, OTHER, ARENA, STARTED))
        self.assertFalse(matches(dict(own, arena_unique_id='1'), ACCOUNT, ARENA, STARTED))
        early_leave = {'player_id': ACCOUNT, 'arena_unique_id': None, 'date_time': STARTED + 60}
        self.assertTrue(matches(early_leave, ACCOUNT, ARENA, STARTED))
        self.assertFalse(matches(dict(early_leave, date_time=STARTED + MATCH_WINDOW_S + 1), ACCOUNT, ARENA, STARTED))
        self.assertFalse(matches(early_leave, ACCOUNT, ARENA, None))
        self.assertFalse(matches({'player_id': None, 'arena_unique_id': str(ARENA)}, ACCOUNT, ARENA, STARTED))
        self.assertFalse(matches(None, ACCOUNT, ARENA, STARTED))

    def test_replay_names(self):
        self.assertTrue(is_replay_name('20260927_1530_ussr-R04_T-34_14_siegfried_line.wotreplay'))
        self.assertTrue(is_replay_name('replay_last_battle.MTREPLAY'))
        self.assertFalse(is_replay_name('temp.wotreplay'))
        self.assertFalse(is_replay_name('notes.txt'))


class FindReplayTest(unittest.TestCase):

    def setUp(self):
        self.folder = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.folder)

    def write(self, name, data, mtime):
        path = os.path.join(self.folder, name)
        with open(path, 'wb') as handle:
            handle.write(data)
        os.utime(path, (mtime, mtime))
        return path

    def test_finds_the_own_replay_of_the_arena(self):
        now = time.time()
        own = self.write('a.wotreplay', replay_bytes(started=now - 600), now - 10)
        self.write('b.wotreplay', replay_bytes(player_id=OTHER, started=now - 600), now - 5)
        self.write('c.wotreplay', replay_bytes(arena_unique_id=ARENA + 1, started=now - 600), now - 4)
        self.write('temp.wotreplay', replay_bytes(started=now - 600), now - 1)
        self.write('d.txt', replay_bytes(started=now - 600), now - 1)
        found = find_replay(self.folder, ACCOUNT, ARENA, now - 600)
        self.assertEqual(found[0], own)
        self.assertEqual(found[1], os.path.getsize(own))

    def test_ignores_files_older_than_the_battle(self):
        now = time.time()
        self.write('old.wotreplay', replay_bytes(started=now - 86400), now - 86400)
        self.assertIsNone(find_replay(self.folder, ACCOUNT, ARENA, now - 600))

    def test_missing_folder(self):
        self.assertIsNone(find_replay(os.path.join(self.folder, 'nope'), ACCOUNT, ARENA, STARTED))


class MultipartTest(unittest.TestCase):

    def test_single_file_part(self):
        content_type, body = build_multipart('battle.wotreplay', b'\x12\x32\x34\x11data', boundary='XyZ')
        self.assertEqual(content_type, 'multipart/form-data; boundary=XyZ')
        self.assertTrue(body.startswith(b'--XyZ\r\nContent-Disposition: form-data; name="file"; filename="battle.wotreplay"\r\n'))
        self.assertIn(b'\r\n\r\n\x12\x32\x34\x11data\r\n--XyZ--\r\n', body)
        self.assertEqual(FILE_FIELD, 'file')

    def test_random_boundary_and_safe_name(self):
        first, _ = build_multipart('a.wotreplay', b'x')
        second, _ = build_multipart('a.wotreplay', b'x')
        self.assertNotEqual(first, second)
        self.assertEqual(upload_name(u'C:\\replays\\20260927 "Т-34"\r\n.wotreplay'.replace('\\', os.sep)), '20260927_-34.wotreplay')
        self.assertEqual(upload_name('x.MTREPLAY'), 'x.mtreplay')
        self.assertEqual(upload_name('x.zip'), 'x.wotreplay')


class UploadJobTest(unittest.TestCase):

    def tearDown(self):
        signing._clock['offset'] = 0.0

    def item(self):
        return {'arena_unique_id': str(ARENA), 'account_id': ACCOUNT, 'started_at': STARTED}

    def run_job(self, transport, data=None, size=None, mtime=None, now=None):
        data = replay_bytes() if data is None else data
        now = time.time() if now is None else now
        found = ('/replays/battle.wotreplay', len(data) if size is None else size, now - 60 if mtime is None else mtime)
        return upload_job(self.item(), creds(), transport, URL, 'ua', lambda item: found, now, read_file=lambda path, limit: data)

    def test_signs_the_raw_file_and_posts_multipart(self):
        transport = SyncFakeTransport((201, b'{"id":"x","status":"uploaded"}', {}))
        result = self.run_job(transport)
        self.assertEqual(result['result'], RESULT_HTTP)
        self.assertEqual(result['status'], 201)
        request = transport.requests[0]
        headers = request['headers']
        self.assertEqual(request['url'], URL)
        self.assertTrue(headers['Content-Type'].startswith('multipart/form-data; boundary='))
        self.assertEqual(headers[signing.DEVICE_HEADER], 'dev-1')
        self.assertTrue(verify_request(SECRET, 'POST', URL, headers, replay_bytes(), SIGNED))
        self.assertFalse(verify_request(SECRET, 'POST', URL, headers, request['body'], SIGNED))
        self.assertFalse(verify_request(SECRET, 'POST', 'https://api.example/mod/ingest', headers, replay_bytes(), SIGNED))
        self.assertIn(replay_bytes(), request['body'])

    def test_private_by_default_and_the_visibility_is_signed(self):
        transport = SyncFakeTransport((201, b'{}', {}))
        self.run_job(transport)
        headers = transport.requests[0]['headers']
        self.assertEqual(headers[VISIBILITY_HEADER], 'private')
        self.assertFalse(verify_request(SECRET, 'POST', URL, headers, replay_bytes()))
        tampered = dict(headers)
        tampered[VISIBILITY_HEADER] = 'public'
        self.assertFalse(verify_request(SECRET, 'POST', URL, tampered, replay_bytes(), SIGNED))

    def test_public_when_asked(self):
        transport = SyncFakeTransport((201, b'{}', {}))
        data = replay_bytes()
        found = ('/replays/battle.wotreplay', len(data), time.time() - 60)
        upload_job(self.item(), creds(), transport, URL, 'ua', lambda item: found, time.time(), read_file=lambda path, limit: data,
                   visibility='public')
        headers = transport.requests[0]['headers']
        self.assertEqual(headers[VISIBILITY_HEADER], 'public')
        self.assertTrue(verify_request(SECRET, 'POST', URL, headers, data, SIGNED))

    def test_stale_clock_is_resigned_once(self):
        server_now = int(time.time()) + 3600
        transport = SyncFakeTransport((STALE_REQUEST_STATUS, b'', {SERVER_TIME_HEADER: str(server_now)}), (201, b'{}', {}))
        result = self.run_job(transport)
        self.assertEqual(result['status'], 201)
        self.assertEqual(len(transport.requests), 2)
        retried = transport.requests[1]['headers']
        self.assertAlmostEqual(int(retried[TIMESTAMP_HEADER]), server_now, delta=2)
        self.assertNotEqual(retried[NONCE_HEADER], transport.requests[0]['headers'][NONCE_HEADER])
        self.assertTrue(verify_request(SECRET, 'POST', URL, retried, replay_bytes(), SIGNED))
        self.assertEqual(retried[VISIBILITY_HEADER], transport.requests[0]['headers'][VISIBILITY_HEADER])

    def test_stale_clock_from_the_date_header(self):
        transport = SyncFakeTransport((STALE_REQUEST_STATUS, b'', {'Date': 'Sun, 27 Sep 2026 10:00:00 GMT'}), (201, b'{}', {}))
        self.assertEqual(self.run_job(transport)['status'], 201)
        self.assertAlmostEqual(int(transport.requests[1]['headers'][TIMESTAMP_HEADER]), 1790503200, delta=5)

    def test_too_large_by_size_is_never_read_or_sent(self):
        transport = SyncFakeTransport()
        self.assertEqual(self.run_job(transport, size=MAX_BYTES + 1)['result'], RESULT_TOO_LARGE)
        self.assertEqual(transport.requests, [])

    def test_too_large_after_reading(self):
        transport = SyncFakeTransport()
        grown = b'x' * (MAX_BYTES + 1)
        self.assertEqual(self.run_job(transport, data=grown, size=10)['result'], RESULT_TOO_LARGE)
        self.assertEqual(transport.requests, [])

    def test_exactly_the_limit_is_sent(self):
        transport = SyncFakeTransport()
        self.assertEqual(self.run_job(transport, data=b'x' * MAX_BYTES)['result'], RESULT_HTTP)

    def test_file_still_being_written_waits(self):
        now = time.time()
        transport = SyncFakeTransport()
        self.assertEqual(self.run_job(transport, mtime=now - 1, now=now)['result'], RESULT_BUSY)
        self.assertEqual(self.run_job(transport, size=0)['result'], RESULT_BUSY)
        self.assertEqual(transport.requests, [])

    def test_missing_replay(self):
        result = upload_job(self.item(), creds(), SyncFakeTransport(), URL, 'ua', lambda item: None, time.time())
        self.assertEqual(result['result'], RESULT_MISSING)

    def test_async_transport_is_an_error(self):
        transport = _support.FakeTransport()
        self.assertEqual(self.run_job(transport)['result'], RESULT_ERROR)


class ClassifyTest(unittest.TestCase):

    def test_statuses(self):
        self.assertEqual(classify_upload(201), OUTCOME_DONE)
        self.assertEqual(classify_upload(409, b'{"code":"REPLAY_DUPLICATE"}'), OUTCOME_DONE)
        self.assertEqual(classify_upload(401), OUTCOME_AUTH)
        self.assertEqual(classify_upload(403, b'{"error":"x","code":"FORBIDDEN"}'), OUTCOME_AUTH)
        self.assertEqual(classify_upload(403, b'{"code":"SUBSCRIPTION_REQUIRED"}'), OUTCOME_QUOTA)
        for status in (400, 413, 422):
            self.assertEqual(classify_upload(status), OUTCOME_DROP)
        for status in (0, 428, 429, 500, 503):
            self.assertEqual(classify_upload(status), OUTCOME_RETRY)


class ReplayQueueTest(unittest.TestCase):

    def queue(self, storage=None):
        return ReplayQueue(storage or MemoryFile(), rng=lambda: 0.5)

    def test_waits_for_the_client_to_finish_the_file(self):
        queue = self.queue()
        self.assertTrue(queue.add(ARENA, ACCOUNT, STARTED, 1000.0))
        self.assertIsNone(queue.next_item(1000.0))
        item = queue.next_item(1000.0 + replay_upload.FIRST_DELAY_S)
        self.assertEqual(item['arena_unique_id'], str(ARENA))
        self.assertEqual(item['account_id'], ACCOUNT)

    def test_dedupes_by_arena_unique_id(self):
        queue = self.queue()
        self.assertTrue(queue.add(ARENA, ACCOUNT, STARTED, 1000.0))
        self.assertFalse(queue.add(str(ARENA), ACCOUNT, STARTED, 1001.0))
        self.assertEqual(len(queue), 1)
        queue.complete(ARENA, {'result': RESULT_HTTP, 'status': 201}, 1100.0)
        self.assertEqual(len(queue), 0)
        self.assertFalse(queue.add(ARENA, ACCOUNT, STARTED, 1200.0))
        self.assertFalse(queue.add(None, ACCOUNT, STARTED, 1200.0))
        self.assertFalse(queue.add(ARENA + 1, None, STARTED, 1200.0))

    def test_pending_and_seen_survive_a_restart(self):
        storage = MemoryFile()
        queue = self.queue(storage)
        queue.add(ARENA, ACCOUNT, STARTED, 1000.0)
        queue.add(ARENA + 1, ACCOUNT, STARTED, 1000.0)
        queue.complete(ARENA + 1, {'result': RESULT_HTTP, 'status': 409}, 1100.0)
        restored = self.queue(storage)
        self.assertEqual([item['arena_unique_id'] for item in restored.items], [str(ARENA)])
        self.assertFalse(restored.add(ARENA + 1, ACCOUNT, STARTED, 1200.0))
        self.assertEqual(restored.next_item(2000.0)['arena_unique_id'], str(ARENA))

    def test_persists_to_a_json_file(self):
        directory = tempfile.mkdtemp()
        try:
            path = os.path.join(directory, 'replays_%d.json' % ACCOUNT)
            ReplayQueue(JsonFile(path)).add(ARENA, ACCOUNT, STARTED, 1000.0)
            self.assertEqual(len(ReplayQueue(JsonFile(path))), 1)
        finally:
            shutil.rmtree(directory)

    def test_exponential_backoff_honours_retry_after(self):
        queue = self.queue()
        queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        self.assertEqual(queue.complete(ARENA, {'result': RESULT_HTTP, 'status': 503}, 100.0), OUTCOME_RETRY)
        self.assertEqual(queue.items[0]['retry_at'], 100.0 + replay_upload.BASE_BACKOFF_S)
        queue.complete(ARENA, {'result': RESULT_ERROR}, 200.0)
        self.assertEqual(queue.items[0]['retry_at'], 200.0 + 2 * replay_upload.BASE_BACKOFF_S)
        queue.complete(ARENA, {'result': RESULT_HTTP, 'status': 429}, 300.0, retry_after=900)
        self.assertEqual(queue.items[0]['retry_at'], 1200.0)
        for _ in range(20):
            queue.complete(ARENA, {'result': RESULT_ERROR}, 300.0)
        self.assertEqual(queue.items[0]['retry_at'], 300.0 + replay_upload.MAX_BACKOFF_S)

    def test_auth_failure_pauses_everything_until_rebind(self):
        queue = self.queue()
        queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        self.assertEqual(queue.complete(ARENA, {'result': RESULT_HTTP, 'status': 401}, 100.0), OUTCOME_AUTH)
        self.assertIsNone(queue.next_item(10000.0))
        queue.unblock()
        self.assertIsNotNone(queue.next_item(10000.0))

    def test_quota_waits_long_without_dropping(self):
        queue = self.queue()
        queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        result = {'result': RESULT_HTTP, 'status': 403, 'body': b'{"code":"SUBSCRIPTION_REQUIRED"}'}
        self.assertEqual(queue.complete(ARENA, result, 100.0), OUTCOME_QUOTA)
        self.assertEqual(queue.items[0]['retry_at'], 100.0 + replay_upload.QUOTA_BACKOFF_S)
        self.assertFalse(queue.auth_blocked)

    def test_invalid_or_too_large_is_dropped_and_remembered(self):
        queue = self.queue()
        queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        queue.add(ARENA + 1, ACCOUNT, STARTED, 0.0)
        self.assertEqual(queue.complete(ARENA, {'result': RESULT_HTTP, 'status': 400}, 100.0), OUTCOME_DROP)
        self.assertEqual(queue.complete(ARENA + 1, {'result': RESULT_TOO_LARGE}, 100.0), OUTCOME_DROP)
        self.assertEqual(len(queue), 0)
        self.assertEqual(queue.dropped, 2)
        self.assertTrue(queue.knows(ARENA + 1))

    def test_missing_file_is_searched_for_then_given_up(self):
        queue = self.queue()
        queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        self.assertEqual(queue.complete(ARENA, {'result': RESULT_MISSING}, 100.0), OUTCOME_WAIT)
        self.assertEqual(queue.items[0]['retry_at'], 100.0 + replay_upload.LOCATE_RETRY_S)
        self.assertEqual(queue.complete(ARENA, {'result': RESULT_BUSY}, 200.0), OUTCOME_WAIT)
        self.assertEqual(queue.items[0]['retry_at'], 200.0 + replay_upload.BUSY_RETRY_S)
        self.assertEqual(queue.complete(ARENA, {'result': RESULT_MISSING}, replay_upload.LOCATE_TIMEOUT_S + 1), OUTCOME_DROP)
        self.assertEqual(len(queue), 0)

    def test_bounded_pending_and_age(self):
        queue = ReplayQueue(MemoryFile(), max_pending=2, rng=lambda: 0.5)
        for offset in range(3):
            queue.add(ARENA + offset, ACCOUNT, STARTED, 0.0)
        self.assertEqual([item['arena_unique_id'] for item in queue.items], [str(ARENA + 1), str(ARENA + 2)])
        self.assertTrue(queue.knows(ARENA))
        self.assertIsNone(queue.next_item(replay_upload.MAX_AGE_S + 1))
        self.assertEqual(len(queue), 0)


class ReplayUploaderTest(unittest.TestCase):

    def setUp(self):
        self.now = [1000.0]
        self.queue = ReplayQueue(MemoryFile(), rng=lambda: 0.5)
        self.runner = InlineRunner()
        self.data = replay_bytes()
        self.auth_failures = []
        self.uploaded = []

    def uploader(self, transport, credentials=None):
        data = self.data
        found = ('/replays/battle.wotreplay', len(data), 0.0)
        uploader = ReplayUploader(self.queue, credentials or creds(), self.runner, transport, URL, 'ua', lambda item: found,
                                  lambda: self.now[0], on_auth_failed=lambda: self.auth_failures.append(1),
                                  on_uploaded=self.uploaded.append, read_file=lambda path, limit: data)
        return uploader

    def test_one_upload_at_a_time_then_done(self):
        transport = SyncFakeTransport((201, b'{}', {}))
        uploader = self.uploader(transport)
        self.queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        self.queue.add(ARENA + 1, ACCOUNT, STARTED, 0.0)
        self.assertTrue(uploader.tick(self.now[0]))
        self.assertFalse(uploader.tick(self.now[0]))
        self.assertEqual(self.runner.poll(), 1)
        self.assertEqual(self.uploaded, [str(ARENA)])
        self.assertEqual(len(self.queue), 1)
        self.assertTrue(uploader.tick(self.now[0]))
        self.runner.poll()
        self.assertEqual(len(transport.requests), 2)
        self.assertEqual(len(self.queue), 0)

    def test_sends_the_visibility_chosen_when_the_upload_starts(self):
        transport = SyncFakeTransport((201, b'{}', {}))
        uploader = self.uploader(transport)
        self.queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        uploader.visibility = 'public'
        uploader.tick(self.now[0])
        uploader.visibility = 'private'
        self.runner.poll()
        self.assertEqual(transport.requests[0]['headers'][VISIBILITY_HEADER], 'public')

    def test_not_owned_replay_is_dropped(self):
        transport = SyncFakeTransport((422, b'{"error":"replay_not_owned","code":"VALIDATION_FAILED"}', {}))
        uploader = self.uploader(transport)
        self.queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        uploader.tick(self.now[0])
        self.runner.poll()
        self.assertEqual(len(self.queue), 0)
        self.assertTrue(self.queue.knows(ARENA))
        self.assertEqual(self.auth_failures, [])

    def test_auth_failure_reaches_the_app(self):
        transport = SyncFakeTransport((401, b'{"error":"bad_signature"}', {}))
        uploader = self.uploader(transport)
        self.queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        uploader.tick(self.now[0])
        self.runner.poll()
        self.assertEqual(self.auth_failures, [1])
        self.assertFalse(uploader.tick(self.now[0]))

    def test_retry_after_header_is_used(self):
        transport = SyncFakeTransport((429, b'', {'Retry-After': '900'}))
        uploader = self.uploader(transport)
        self.queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        uploader.tick(self.now[0])
        self.runner.poll()
        self.assertEqual(self.queue.items[0]['retry_at'], self.now[0] + 900)

    def test_needs_valid_credentials(self):
        uploader = self.uploader(SyncFakeTransport(), credentials=Credentials('dev-1', 'short', ACCOUNT))
        self.queue.add(ARENA, ACCOUNT, STARTED, 0.0)
        self.assertFalse(uploader.tick(self.now[0]))


class BackgroundRunnerTest(unittest.TestCase):

    def test_job_runs_off_thread_and_callback_on_poll(self):
        runner = BackgroundRunner('otmetki-test')
        seen = {}
        main = threading.current_thread()

        def job():
            seen['job_thread'] = threading.current_thread()
            return 42

        def done(result):
            seen['result'] = result
            seen['callback_thread'] = threading.current_thread()

        runner.submit(job, done)
        runner.submit(lambda: 1 // 0, lambda result: seen.setdefault('failed', result))
        deadline = time.time() + 5
        while 'failed' not in seen and time.time() < deadline:
            runner.poll()
            time.sleep(0.01)
        runner.stop()
        self.assertEqual(seen['result'], 42)
        self.assertIsNot(seen['job_thread'], main)
        self.assertIs(seen['callback_thread'], main)
        self.assertIsNone(seen['failed'])


class ReplaySettingsTest(unittest.TestCase):

    def test_off_by_default(self):
        self.assertIn('upload_replays', FEATURES)
        self.assertIn('upload_replays', OPT_IN_FEATURES)
        self.assertFalse(Config().is_enabled('upload_replays'))
        self.assertTrue(Config({'upload_replays': True}).is_enabled('upload_replays'))
        self.assertFalse(Config({'upload_replays': True, 'enabled': False}).is_enabled('upload_replays'))
        self.assertFalse(Config({'upload_replays': 'yes'}).is_enabled('upload_replays'))

    def test_settings_window_switch(self):
        template = build_template(Config(), Translator('ru'), 'status')
        checkbox = [c for c in template['column1'] if c['varName'] == 'upload_replays'][0]
        self.assertFalse(checkbox['value'])
        self.assertIn(u'реплеи', checkbox['text'])
        self.assertEqual(settings_to_config({'upload_replays': True}), {'upload_replays': True})

    def test_publishing_is_off_by_default(self):
        self.assertIn('publish_replays', FEATURES)
        self.assertIn('publish_replays', OPT_IN_FEATURES)
        self.assertFalse(Config().is_enabled('publish_replays'))
        self.assertTrue(Config({'publish_replays': True}).is_enabled('publish_replays'))
        self.assertEqual(settings_to_config({'publish_replays': True}), {'publish_replays': True})

    def test_publish_switch_sits_next_to_upload(self):
        self.assertEqual(FEATURES.index('publish_replays'), FEATURES.index('upload_replays') + 1)
        for language, word in (('ru', u'публичн'), ('en', u'public')):
            template = build_template(Config(), Translator(language), 'status')
            checkbox = [c for c in template['column1'] if c['varName'] == 'publish_replays'][0]
            self.assertFalse(checkbox['value'])
            self.assertIn(word, checkbox['text'].lower())


class ReplayContractTest(unittest.TestCase):

    def test_constants_match_the_contract(self):
        limits = _support.schema('replay-upload.schema.json')['definitions']['limits']['default']
        self.assertEqual(limits['path'], UPLOAD_PATH)
        self.assertEqual(limits['field'], FILE_FIELD)
        self.assertEqual(limits['max_bytes'], MAX_BYTES)
        self.assertEqual(tuple(limits['extensions']), EXTENSIONS)
        self.assertEqual(limits['visibility_header'], VISIBILITY_HEADER)
        self.assertEqual(limits['visibilities'], [VISIBILITY_PRIVATE, VISIBILITY_PUBLIC])
        self.assertEqual(limits['default_visibility'], VISIBILITY_PRIVATE)
        consts = _support.schema('replay-upload.schema.json')['definitions']['limits']['properties']
        self.assertEqual(dict((key, value['const']) for key, value in consts.items()), limits)

    def test_contract_matches_the_server_config(self):
        path = os.path.join(_support.MODPACK_DIR, '..', 'server', 'src', 'modules', 'replays', 'config', 'replays.config.ts')
        if not os.path.exists(path):
            self.skipTest('server sources are not next to the mod')
        with io.open(path, 'r', encoding='utf-8') as handle:
            source = handle.read()
        limits = _support.schema('replay-upload.schema.json')['definitions']['limits']['default']

        def number(key):
            expression = re.search(key + r':\s*([\d\s*_]+),', source).group(1)
            value = 1
            for factor in expression.replace('_', '').split('*'):
                value *= int(factor)
            return value

        self.assertEqual(number('maxBytes'), limits['max_bytes'])
        self.assertEqual(number('multipartOverheadBytes'), limits['multipart_overhead_bytes'])
        self.assertIn("field: '%s'" % limits['field'], source)
        self.assertIn("extensions: [%s]" % ', '.join("'%s'" % ext for ext in limits['extensions']), source)
        self.assertIn("visibilityHeader: '%s'" % limits['visibility_header'].lower(), source)
        self.assertIn("modVisibilities: [%s]" % ', '.join("'%s'" % value for value in limits['visibilities']), source)
        self.assertIn("modDefaultVisibility: '%s'" % limits['default_visibility'], source)

    def test_response_example_validates(self):
        validator = _support.schema_validator('replay-upload.schema.json', 'response')
        if validator is None:
            self.skipTest('jsonschema not installed')
        validator.validate({'id': '0b0f9a6e-9a36-4f59-8a61-1d1a4b6a0c11', 'status': 'uploaded'})


if __name__ == '__main__':
    unittest.main()
