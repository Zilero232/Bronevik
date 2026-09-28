from __future__ import absolute_import, division, print_function, unicode_literals

import io
import os
import threading

from ....core.codec import parse_retry_after
from ....core.net.signing import signed_request
from ....core.net.transport import StoppableBody
from .constants import MAX_BYTES, SETTLE_S, VISIBILITY_HEADER, VISIBILITY_PRIVATE, JobResult, Outcome
from .files import build_multipart
from .queue import uploaded_replay_id

# upload_job runs on the worker thread: its transport must answer inside request() (transport.SyncTransport), so
# the 428 clock-skew retry of signing.signed_request happens there too. ReplayUploader drives it from the main
# thread, one upload in flight. Entering a battle pauses it: the running upload stops at its next block
# (StoppableBody) and is retried as it was, without a backoff, once the player is back in the hangar.


def _read_file(path, limit):
    with io.open(path, 'rb') as handle:
        return handle.read(limit + 1)


def _never():
    return False


def _read_found(item, finder, now, read_file):
    # A replay renamed between the search and the read (the replay manager's auto-rename) is looked up again
    # once: the search goes by the file's header, not its name.
    for _ in range(2):
        found = finder(item)
        if not found:
            return {'result': JobResult.MISSING}, None
        path, size, mtime = found
        if size > MAX_BYTES:
            return {'result': JobResult.TOO_LARGE}, None
        if size <= 0 or now - mtime < SETTLE_S:
            return {'result': JobResult.BUSY}, None
        try:
            return None, (path, (read_file or _read_file)(path, MAX_BYTES))
        except (IOError, OSError):
            continue
    return {'result': JobResult.MISSING}, None


def upload_job(item, credentials, transport, url, user_agent, finder, now, read_file=None, visibility=VISIBILITY_PRIVATE, should_stop=None):
    stopped = should_stop or _never
    if stopped():
        return {'result': JobResult.STOPPED}
    refusal, found = _read_found(item, finder, now, read_file)
    if refusal is not None:
        return refusal
    path, data = found
    if len(data) > MAX_BYTES:
        return {'result': JobResult.TOO_LARGE}
    if stopped():
        return {'result': JobResult.STOPPED}
    content_type, body = build_multipart(os.path.basename(path), data)
    if should_stop is not None:
        body = StoppableBody(body, should_stop)
    reply = {}

    def done(status, response_body, response_headers):
        reply.update({'status': status, 'body': response_body, 'headers': response_headers or {}})

    signed_request(transport, 'POST', url, credentials.device_id, credentials.secret, body, user_agent, done,
                   content_type=content_type, signed_body=data, extra_headers=[(VISIBILITY_HEADER, visibility)])
    if stopped():
        return {'result': JobResult.STOPPED}
    if 'status' not in reply:
        return {'result': JobResult.ERROR}
    reply['result'] = JobResult.HTTP
    return reply


class ReplayUploader(object):

    def __init__(self, queue, credentials, runner, transport, url, user_agent, finder, clock,
                 on_auth_failed=None, on_uploaded=None, read_file=None, visibility=VISIBILITY_PRIVATE, on_replay_id=None):
        self.queue = queue
        self.credentials = credentials
        self.runner = runner
        self.transport = transport
        self.url = url
        self.user_agent = user_agent
        self.finder = finder
        self.clock = clock
        self.on_auth_failed = on_auth_failed
        self.on_uploaded = on_uploaded
        self.on_replay_id = on_replay_id
        self.read_file = read_file
        self.visibility = visibility
        self.in_flight = None
        self.paused = threading.Event()

    def pause(self):
        self.paused.set()

    def resume(self):
        self.paused.clear()

    def tick(self, now):
        if self.in_flight is not None or self.paused.is_set():
            return False
        creds = self.credentials
        if creds is None or not creds.is_valid():
            return False
        item = self.queue.next_item(now)
        if item is None:
            return False
        self.in_flight = item['arena_unique_id']
        transport, url, user_agent, finder, clock, read_file = self.transport, self.url, self.user_agent, self.finder, self.clock, self.read_file
        visibility = self.visibility
        should_stop = self.paused.is_set

        def job():
            return upload_job(item, creds, transport, url, user_agent, finder, clock(), read_file, visibility, should_stop)

        self.runner.submit(job, self._complete)
        return True

    def _complete(self, result):
        arena_unique_id = self.in_flight
        self.in_flight = None
        if arena_unique_id is None:
            return None
        retry_after = parse_retry_after((result or {}).get('headers'))
        outcome = self.queue.complete(arena_unique_id, result, self.clock(), retry_after)
        if outcome == Outcome.AUTH and self.on_auth_failed is not None:
            self.on_auth_failed()
        if outcome == Outcome.DONE and self.on_uploaded is not None:
            self.on_uploaded(arena_unique_id)
        if outcome == Outcome.DONE and self.on_replay_id is not None:
            self.on_replay_id(arena_unique_id, uploaded_replay_id(result))
        return outcome
