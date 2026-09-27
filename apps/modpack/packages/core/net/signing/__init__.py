"""HMAC-SHA256 request signing (v2) shared with the server, and the clock offset its 428 answers correct."""
import binascii
import hashlib
import hmac
import os
import time
from email.utils import mktime_tz, parsedate_tz

from ...compat import to_bytes, to_text
from .constants import (DEVICE_HEADER, JSON_CONTENT_TYPE, NONCE_BYTES, NONCE_HEADER, SERVER_TIME_HEADER, SIGNATURE_HEADER,  # noqa: F401
                        SIGNATURE_PREFIX, SIGNATURE_VERSION, STALE_REQUEST_STATUS, TIMESTAMP_HEADER)

_clock = {'offset': 0.0}


def sign(secret, body):
    digest = hmac.new(to_bytes(secret), to_bytes(body), hashlib.sha256).hexdigest()
    return SIGNATURE_PREFIX + digest


def _constant_time_equals(left, right):
    compare = getattr(hmac, 'compare_digest', None)
    if compare is not None:
        return compare(to_bytes(left), to_bytes(right))
    left = to_bytes(left)
    right = to_bytes(right)
    if len(left) != len(right):
        return False
    result = 0
    for a, b in zip(bytearray(left), bytearray(right)):
        result |= a ^ b
    return result == 0


def verify(secret, body, signature):
    return _constant_time_equals(sign(secret, body), signature)


def request_path(url):
    rest = url.split('://', 1)[-1]
    slash = rest.find('/')
    path = rest[slash:] if slash >= 0 else '/'
    return path.split('#', 1)[0].split('?', 1)[0]


def new_nonce():
    return str(binascii.hexlify(os.urandom(NONCE_BYTES)).decode('ascii'))


def signed_message(method, path, timestamp, nonce, body, extra_headers=()):
    """v2 message: version, method, path, timestamp and nonce lines, then one `name:value` line per
    signed header (lower-case name, in the order sent), then the raw body. Mirrors signedMessage in
    apps/server/src/modules/mod/lib/request-signature."""
    lines = [SIGNATURE_VERSION, method.upper(), path, str(timestamp), nonce]
    lines.extend(to_text(name).lower() + ':' + to_text(value) for name, value in extra_headers)
    return to_bytes('\n'.join(lines) + '\n') + to_bytes(body)


def verify_request(secret, method, url, headers, body, signed_names=()):
    extra = [(name, headers[name]) for name in signed_names if name in headers]
    message = signed_message(method, request_path(url), headers.get(TIMESTAMP_HEADER, ''), headers.get(NONCE_HEADER, ''), body, extra)
    return verify(secret, message, headers.get(SIGNATURE_HEADER, ''))


def clock_offset():
    return _clock['offset']


def server_time(headers):
    if not isinstance(headers, dict):
        return None
    values = dict((to_text(key).lower(), to_text(value).strip()) for key, value in headers.items())
    raw = values.get(SERVER_TIME_HEADER.lower(), '')
    if raw.isdigit():
        return float(raw)
    parsed = parsedate_tz(values.get('date', ''))
    return float(mktime_tz(parsed)) if parsed else None


def sync_clock(headers, now=None):
    server = server_time(headers)
    if server is None:
        return False
    _clock['offset'] = server - (now if now is not None else time.time())
    return True


def signed_headers(device_id, secret, body, user_agent, method, url, now=None, nonce=None, content_type=JSON_CONTENT_TYPE,
                   extra_headers=()):
    timestamp = str(int(now if now is not None else time.time() + _clock['offset']))
    nonce = nonce or new_nonce()
    extra_headers = list(extra_headers)
    headers = {
        'Content-Type': content_type,
        'Accept': 'application/json',
        'User-Agent': user_agent,
        DEVICE_HEADER: device_id,
        TIMESTAMP_HEADER: timestamp,
        NONCE_HEADER: nonce,
        SIGNATURE_HEADER: sign(secret, signed_message(method, request_path(url), timestamp, nonce, body, extra_headers)),
    }
    headers.update(extra_headers)
    return headers


def signed_request(transport, method, url, device_id, secret, body, user_agent, callback, content_type=JSON_CONTENT_TYPE, signed_body=None,
                   extra_headers=()):
    """Signs and sends; on a 428 with a usable server time it re-syncs the clock and re-signs once.

    `signed_body` is what the HMAC covers when it differs from the bytes on the wire: a multipart
    upload is signed over the raw file, which is what the server verifies after parsing the form.
    `extra_headers` are (name, value) pairs sent and covered by the signature (see signed_message).
    """
    covered = body if signed_body is None else signed_body

    def send(may_retry):
        def done(status, response_body, response_headers):
            if status == STALE_REQUEST_STATUS and may_retry and sync_clock(response_headers):
                send(False)
                return
            callback(status, response_body, response_headers)

        headers = signed_headers(device_id, secret, covered, user_agent, method, url, content_type=content_type, extra_headers=extra_headers)
        transport.request(method, url, headers, body, done)

    send(True)
