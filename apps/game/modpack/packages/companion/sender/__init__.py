from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.codec import encode_json, parse_json_body, parse_retry_after
from ...core.net.signing import SignedRequest, signed_request
from ...core.vendor import attr
from ..outbox import Outcome
from ..payload import build_envelope
from .constants import INGEST_PATH  # noqa: F401


@attr.s
class IngestEndpoint(object):

    url = attr.ib()
    user_agent = attr.ib()
    mod_version = attr.ib()
    client_version = attr.ib()


class IngestSender(object):

    def __init__(self, outbox, credentials, transport, endpoint, on_response=None, on_auth_failed=None, clock=None):
        self.outbox = outbox
        self.credentials = credentials
        self.transport = transport
        self.endpoint = endpoint
        self.on_response = on_response
        self.on_auth_failed = on_auth_failed
        self.clock = clock
        self.in_flight = None

    def tick(self, now):
        if self.in_flight is not None:
            return False
        credentials = self.credentials
        if credentials is None or not credentials.is_valid():
            return False
        batch = self.outbox.next_batch(now)
        if not batch:
            return False

        self._send(batch, credentials, now)
        return True

    def _send(self, batch, credentials, now):
        endpoint = self.endpoint
        envelope = build_envelope(
            batch,
            credentials.device_id,
            credentials.account_id,
            endpoint.mod_version,
            endpoint.client_version,
            now,
        )
        body = encode_json(envelope)
        self.in_flight = batch

        def done(status, response_body, response_headers):
            self._complete(batch, status, response_body, response_headers)

        request = SignedRequest(
            method='POST',
            url=endpoint.url,
            device_id=credentials.device_id,
            secret=credentials.secret,
            body=body,
            user_agent=endpoint.user_agent,
        )
        signed_request(self.transport, request, done)

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
