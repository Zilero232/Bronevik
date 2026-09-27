import binascii
import hashlib
import hmac
import os
import time

from .compat import to_bytes

DEVICE_HEADER = 'X-Otmetki-Device'
SIGNATURE_HEADER = 'X-Otmetki-Signature'
TIMESTAMP_HEADER = 'X-Otmetki-Timestamp'
NONCE_HEADER = 'X-Otmetki-Nonce'
SIGNATURE_PREFIX = 'sha256='
SIGNATURE_VERSION = 'v2'
NONCE_BYTES = 16


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


def signed_message(method, path, timestamp, nonce, body):
    head = '\n'.join([SIGNATURE_VERSION, method.upper(), path, str(timestamp), nonce]) + '\n'
    return to_bytes(head) + to_bytes(body)


def verify_request(secret, method, url, headers, body):
    message = signed_message(method, request_path(url), headers.get(TIMESTAMP_HEADER, ''), headers.get(NONCE_HEADER, ''), body)
    return verify(secret, message, headers.get(SIGNATURE_HEADER, ''))


def signed_headers(device_id, secret, body, user_agent, method, url, now=None, nonce=None):
    timestamp = str(int(now if now is not None else time.time()))
    nonce = nonce or new_nonce()
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': user_agent,
        DEVICE_HEADER: device_id,
        TIMESTAMP_HEADER: timestamp,
        NONCE_HEADER: nonce,
        SIGNATURE_HEADER: sign(secret, signed_message(method, request_path(url), timestamp, nonce, body)),
    }
