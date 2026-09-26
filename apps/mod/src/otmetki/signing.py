import hashlib
import hmac

from .compat import to_bytes

DEVICE_HEADER = 'X-Otmetki-Device'
SIGNATURE_HEADER = 'X-Otmetki-Signature'
SIGNATURE_PREFIX = 'sha256='


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


def signed_headers(device_id, secret, body, user_agent):
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': user_agent,
        DEVICE_HEADER: device_id,
        SIGNATURE_HEADER: sign(secret, body),
    }
