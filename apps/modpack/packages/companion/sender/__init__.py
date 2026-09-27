from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.codec import encode_json, parse_json_body, parse_retry_after
from ...core.net.signing import signed_request
from ..outbox import Outcome
from ..payload import build_envelope
from .constants import INGEST_PATH  # noqa: F401


class IngestSender(object):

    def __init__(self, outbox, credentials, transport, url, mod_version, client_version, user_agent,
                 on_response=None, on_auth_failed=None, clock=None):
        self.outbox = outbox
        self.credentials = credentials
        self.transport = transport
        self.url = url
        self.mod_version = mod_version
        self.client_version = client_version
        self.user_agent = user_agent
        self.on_response = on_response
        self.on_auth_failed = on_auth_failed
        self.clock = clock
        self.in_flight = None

    def tick(self, now):
        if self.in_flight is not None:
            return False
        creds = self.credentials
        if creds is None or not creds.is_valid():
            return False
        batch = self.outbox.next_batch(now)
        if not batch:
            return False
        envelope = build_envelope(batch, creds.device_id, creds.account_id, self.mod_version, self.client_version, now)
        body = encode_json(envelope)
        self.in_flight = batch

        def done(status, response_body, response_headers):
            self._complete(batch, status, response_body, response_headers)

        signed_request(self.transport, 'POST', self.url, creds.device_id, creds.secret, body, self.user_agent, done)
        return True

    def _complete(self, batch, status, body, headers):
        self.in_flight = None
        now = self.clock() if self.clock is not None else 0.0
        outcome = self.outbox.complete(batch, status, now, parse_retry_after(headers))
        if outcome == Outcome.AUTH and self.on_auth_failed is not None:
            self.on_auth_failed()
        if outcome == Outcome.SENT and self.on_response is not None:
            data = parse_json_body(body)
            if data is not None:
                self.on_response(data)
        return outcome
