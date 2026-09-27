from __future__ import absolute_import, division, print_function, unicode_literals

import base64
import binascii
import json
import zlib

from ...core.compat import string_types, to_bytes, to_text
from .constants import CODE_MAX_CHARS, CODE_PREFIX, ERROR_CODE
from .errors import ProfileError


def encode_profile(name, snapshot):
    """A copy-paste code of a profile: prefix + base64url(zlib(JSON))."""
    raw = json.dumps({'name': name, 'data': snapshot}, sort_keys=True, separators=(',', ':'), ensure_ascii=True)
    packed = base64.urlsafe_b64encode(zlib.compress(to_bytes(raw), 9))
    return CODE_PREFIX + to_text(packed).rstrip('=')


def decode_profile(code):
    """(name, snapshot) of a profile code, or ProfileError('code')."""
    if not isinstance(code, string_types):
        raise ProfileError(ERROR_CODE)
    code = to_text(code).strip()
    if not code.startswith(CODE_PREFIX) or len(code) > CODE_MAX_CHARS:
        raise ProfileError(ERROR_CODE)
    body = code[len(CODE_PREFIX):]
    body += '=' * (-len(body) % 4)
    try:
        payload = json.loads(to_text(zlib.decompress(base64.urlsafe_b64decode(to_bytes(body)))))
    except (TypeError, ValueError, binascii.Error, zlib.error, UnicodeDecodeError):
        raise ProfileError(ERROR_CODE)
    data = payload.get('data') if isinstance(payload, dict) else None
    if not isinstance(data, dict) or not isinstance(data.get('config', {}), dict) or not isinstance(data.get('components', {}), dict):
        raise ProfileError(ERROR_CODE)
    name = payload.get('name')
    return (to_text(name) if isinstance(name, string_types) else ''), {'config': data.get('config') or {}, 'components': data.get('components') or {}}
