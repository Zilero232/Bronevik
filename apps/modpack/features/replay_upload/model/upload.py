"""One upload at a time: the worker-thread job (locate, read, sign, post) and its main-thread driver."""
import io
import os

from ....core.codec import parse_retry_after
from ....core.net.signing import signed_request
from .constants import MAX_BYTES, SETTLE_S, VISIBILITY_HEADER, VISIBILITY_PRIVATE, JobResult, Outcome
from .files import build_multipart
from .queue import uploaded_replay_id


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
        return {'result': JobResult.MISSING}
    path, size, mtime = found
    if size > MAX_BYTES:
        return {'result': JobResult.TOO_LARGE}
    if size <= 0 or now - mtime < SETTLE_S:
        return {'result': JobResult.BUSY}
    try:
        data = (read_file or _read_file)(path, MAX_BYTES)
    except (IOError, OSError):
        return {'result': JobResult.MISSING}
    if len(data) > MAX_BYTES:
        return {'result': JobResult.TOO_LARGE}
    content_type, body = build_multipart(os.path.basename(path), data)
    reply = {}

    def done(status, response_body, response_headers):
        reply.update({'status': status, 'body': response_body, 'headers': response_headers or {}})

    signed_request(transport, 'POST', url, credentials.device_id, credentials.secret, body, user_agent, done,
                   content_type=content_type, signed_body=data, extra_headers=[(VISIBILITY_HEADER, visibility)])
    if 'status' not in reply:
        return {'result': JobResult.ERROR}
    reply['result'] = JobResult.HTTP
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
        if outcome == Outcome.AUTH and self.on_auth_failed is not None:
            self.on_auth_failed()
        if outcome == Outcome.DONE and self.on_uploaded is not None:
            self.on_uploaded(arena_unique_id)
        if outcome == Outcome.DONE and self.on_replay_id is not None:
            self.on_replay_id(arena_unique_id, uploaded_replay_id(result))
        return outcome
