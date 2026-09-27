from .compat import to_text
from .jsonutil import dumps_bytes, loads
from .outbox import OUTCOME_AUTH, OUTCOME_SENT
from .payload import build_envelope
from .signing import signed_headers

INGEST_PATH = '/mod/ingest'


def parse_retry_after(headers):
    if not isinstance(headers, dict):
        return None
    for key, value in headers.items():
        if to_text(key).lower() == 'retry-after':
            try:
                return float(to_text(value).strip())
            except (TypeError, ValueError):
                return None
    return None


def parse_json_body(body):
    if not body:
        return None
    try:
        data = loads(body)
    except (ValueError, UnicodeDecodeError):
        return None
    return data if isinstance(data, dict) else None


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
        body = dumps_bytes(envelope)
        headers = signed_headers(creds.device_id, creds.secret, body, self.user_agent, 'POST', self.url)
        self.in_flight = batch

        def done(status, response_body, response_headers):
            self._complete(batch, status, response_body, response_headers)

        self.transport.request('POST', self.url, headers, body, done)
        return True

    def _complete(self, batch, status, body, headers):
        self.in_flight = None
        now = self.clock() if self.clock is not None else 0.0
        outcome = self.outbox.complete(batch, status, now, parse_retry_after(headers))
        if outcome == OUTCOME_AUTH and self.on_auth_failed is not None:
            self.on_auth_failed()
        if outcome == OUTCOME_SENT and self.on_response is not None:
            data = parse_json_body(body)
            if data is not None:
                self.on_response(data)
        return outcome
