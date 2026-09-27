"""Opt-in replay auto-upload: a persistent per-account queue of own battles and the uploader that
runs one upload at a time on a background runner (see core.transport.BackgroundRunner).

A queued battle waits until the client has finished writing its replay, is located by
files.find_replay, and is posted to /replays/mod signed over the raw file bytes.
"""
import io
import os
import random

from ...companion.sender import parse_retry_after
from ...core.compat import string_types, to_text
from ...core.jsonutil import loads
from ...core.signing import signed_request
from .files import MAX_BYTES, SETTLE_S, VISIBILITY_HEADER, VISIBILITY_PRIVATE, build_multipart

MAX_PENDING = 50
MAX_SEEN = 500
FIRST_DELAY_S = 30.0
BUSY_RETRY_S = 15.0
LOCATE_RETRY_S = 60.0
LOCATE_TIMEOUT_S = 30 * 60.0
BASE_BACKOFF_S = 30.0
MAX_BACKOFF_S = 3600.0
QUOTA_BACKOFF_S = 6 * 3600.0
MAX_AGE_S = 7 * 24 * 3600.0
JITTER = 0.2

RESULT_HTTP = 'http'
RESULT_MISSING = 'missing'
RESULT_BUSY = 'busy'
RESULT_TOO_LARGE = 'too_large'
RESULT_ERROR = 'error'

OUTCOME_DONE = 'done'
OUTCOME_DROP = 'drop'
OUTCOME_AUTH = 'auth'
OUTCOME_QUOTA = 'quota'
OUTCOME_RETRY = 'retry'
OUTCOME_WAIT = 'wait'

QUOTA_CODE = 'SUBSCRIPTION_REQUIRED'


def _error_code(body):
    if not body:
        return None
    try:
        data = loads(body)
    except (ValueError, UnicodeDecodeError):
        return None
    return data.get('code') if isinstance(data, dict) else None


def uploaded_replay_id(result):
    """The site's id of an uploaded replay (the 201 body), or None (409 duplicate, unreadable body)."""
    if not isinstance(result, dict) or result.get('status') != 201 or not result.get('body'):
        return None
    try:
        data = loads(result['body'])
    except (ValueError, UnicodeDecodeError):
        return None
    replay_id = data.get('id') if isinstance(data, dict) else None
    return to_text(replay_id) if isinstance(replay_id, string_types) and replay_id else None


def classify_upload(status, body=None):
    if 200 <= status < 300 or status == 409:
        return OUTCOME_DONE
    if status == 401:
        return OUTCOME_AUTH
    if status == 403:
        return OUTCOME_QUOTA if _error_code(body) == QUOTA_CODE else OUTCOME_AUTH
    if status in (400, 404, 413, 415, 422):
        return OUTCOME_DROP
    return OUTCOME_RETRY


class ReplayQueue(object):
    """Pending own battles of one account, persisted so uploads survive a client restart.

    Deduplicates by arenaUniqueID across pending items and the last MAX_SEEN finished ones.
    """

    def __init__(self, storage, max_pending=MAX_PENDING, max_seen=MAX_SEEN, rng=None):
        self.storage = storage
        self.max_pending = max_pending
        self.max_seen = max_seen
        self.rng = rng or random.random
        self.auth_blocked = False
        self.items = []
        self.seen = []
        self.dropped = 0
        data = storage.read({}) or {}
        if isinstance(data, dict):
            items = data.get('items')
            seen = data.get('seen')
            if isinstance(items, list):
                self.items = [dict(item) for item in items if isinstance(item, dict) and item.get('arena_unique_id')]
            if isinstance(seen, list):
                self.seen = [to_text(value) for value in seen][-max_seen:]

    def _persist(self):
        self.storage.write({'items': self.items, 'seen': self.seen})

    def __len__(self):
        return len(self.items)

    def _find(self, arena_unique_id):
        for item in self.items:
            if item['arena_unique_id'] == arena_unique_id:
                return item
        return None

    def knows(self, arena_unique_id):
        key = to_text(arena_unique_id)
        return key in self.seen or self._find(key) is not None

    def add(self, arena_unique_id, account_id, started_at, now):
        if not arena_unique_id or not account_id:
            return False
        key = to_text(arena_unique_id)
        if self.knows(key):
            return False
        self.items.append({
            'arena_unique_id': key,
            'account_id': int(account_id),
            'started_at': float(started_at) if started_at is not None else None,
            'ended_at': float(now),
            'attempt': 0,
            'retry_at': float(now) + FIRST_DELAY_S,
        })
        overflow = len(self.items) - self.max_pending
        if overflow > 0:
            for item in self.items[:overflow]:
                self._mark_seen(item['arena_unique_id'])
            self.items = self.items[overflow:]
            self.dropped += overflow
        self._persist()
        return True

    def next_item(self, now):
        if self.auth_blocked:
            return None
        expired = [item for item in self.items if now - item['ended_at'] > MAX_AGE_S]
        for item in expired:
            self._finish(item, False)
        if expired:
            self._persist()
        ready = [item for item in self.items if item['retry_at'] <= now]
        if not ready:
            return None
        return dict(min(ready, key=lambda item: item['retry_at']))

    def _mark_seen(self, key):
        if key not in self.seen:
            self.seen.append(key)
            self.seen = self.seen[-self.max_seen:]

    def _finish(self, item, uploaded):
        self.items = [other for other in self.items if other is not item]
        self._mark_seen(item['arena_unique_id'])
        if not uploaded:
            self.dropped += 1

    def _backoff(self, item, now, retry_after=None):
        item['attempt'] = item.get('attempt', 0) + 1
        delay = min(MAX_BACKOFF_S, BASE_BACKOFF_S * (2 ** (item['attempt'] - 1)))
        delay *= 1.0 + JITTER * (2.0 * self.rng() - 1.0)
        if retry_after is not None and retry_after > delay:
            delay = min(MAX_BACKOFF_S, float(retry_after))
        item['retry_at'] = now + delay
        return delay

    def complete(self, arena_unique_id, result, now, retry_after=None):
        """Applies a job result (see upload_job) to the item and returns the outcome."""
        item = self._find(to_text(arena_unique_id))
        if item is None:
            return OUTCOME_DROP
        kind = (result or {}).get('result', RESULT_ERROR)
        if kind == RESULT_HTTP:
            outcome = classify_upload(result.get('status', 0), result.get('body'))
        elif kind == RESULT_TOO_LARGE:
            outcome = OUTCOME_DROP
        elif kind == RESULT_BUSY:
            item['retry_at'] = now + BUSY_RETRY_S
            outcome = OUTCOME_WAIT
        elif kind == RESULT_MISSING:
            if now - item['ended_at'] > LOCATE_TIMEOUT_S:
                outcome = OUTCOME_DROP
            else:
                item['retry_at'] = now + LOCATE_RETRY_S
                outcome = OUTCOME_WAIT
        else:
            outcome = OUTCOME_RETRY
        if outcome == OUTCOME_DONE:
            self._finish(item, True)
        elif outcome == OUTCOME_DROP:
            self._finish(item, False)
        elif outcome == OUTCOME_AUTH:
            self.auth_blocked = True
        elif outcome == OUTCOME_QUOTA:
            item['retry_at'] = now + QUOTA_BACKOFF_S
        elif outcome == OUTCOME_RETRY:
            self._backoff(item, now, retry_after)
        self._persist()
        return outcome

    def unblock(self):
        self.auth_blocked = False


def _read_file(path, limit):
    with io.open(path, 'rb') as handle:
        return handle.read(limit + 1)


def upload_job(item, credentials, transport, url, user_agent, finder, now, read_file=None, visibility=VISIBILITY_PRIVATE):
    """Runs on the worker thread: locate, size-check, read, sign and post one replay synchronously.

    `visibility` (private or public) goes in the signed X-Otmetki-Visibility header.

    `transport` must answer inside request() (transport.SyncTransport), so the 428 clock-skew
    retry in signing.signed_request happens here too. Returns a result dict for ReplayQueue.complete.
    """
    found = finder(item)
    if not found:
        return {'result': RESULT_MISSING}
    path, size, mtime = found
    if size > MAX_BYTES:
        return {'result': RESULT_TOO_LARGE}
    if size <= 0 or now - mtime < SETTLE_S:
        return {'result': RESULT_BUSY}
    try:
        data = (read_file or _read_file)(path, MAX_BYTES)
    except (IOError, OSError):
        return {'result': RESULT_MISSING}
    if len(data) > MAX_BYTES:
        return {'result': RESULT_TOO_LARGE}
    content_type, body = build_multipart(os.path.basename(path), data)
    reply = {}

    def done(status, response_body, response_headers):
        reply.update({'status': status, 'body': response_body, 'headers': response_headers or {}})

    signed_request(transport, 'POST', url, credentials.device_id, credentials.secret, body, user_agent, done,
                   content_type=content_type, signed_body=data, extra_headers=[(VISIBILITY_HEADER, visibility)])
    if 'status' not in reply:
        return {'result': RESULT_ERROR}
    reply['result'] = RESULT_HTTP
    return reply


class ReplayUploader(object):
    """Main-thread driver: at most one upload in flight, the job itself runs on `runner`."""

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

    def tick(self, now):
        if self.in_flight is not None:
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

        def job():
            return upload_job(item, creds, transport, url, user_agent, finder, clock(), read_file, visibility)

        self.runner.submit(job, self._complete)
        return True

    def _complete(self, result):
        arena_unique_id = self.in_flight
        self.in_flight = None
        if arena_unique_id is None:
            return None
        retry_after = parse_retry_after((result or {}).get('headers'))
        outcome = self.queue.complete(arena_unique_id, result, self.clock(), retry_after)
        if outcome == OUTCOME_AUTH and self.on_auth_failed is not None:
            self.on_auth_failed()
        if outcome == OUTCOME_DONE and self.on_uploaded is not None:
            self.on_uploaded(arena_unique_id)
        if outcome == OUTCOME_DONE and self.on_replay_id is not None:
            self.on_replay_id(arena_unique_id, uploaded_replay_id(result))
        return outcome

