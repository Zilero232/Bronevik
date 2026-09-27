"""JSON on the standard library's `json`: the canonical form (sorted keys, no spaces, ASCII) the signed
request bodies, the compact state files and the UI messages share, and the site's response bodies."""
from __future__ import absolute_import, division, print_function, unicode_literals

import json

from ..compat import to_bytes, to_text
from .constants import CANONICAL


def canonical_json(obj):
    """`obj` as canonical JSON text."""
    return json.dumps(obj, **CANONICAL)


def encode_json(obj):
    """The canonical UTF-8 body of `obj`."""
    return to_bytes(canonical_json(obj))


def decode_json(data):
    """`json.loads` over bytes or text; raises ValueError / UnicodeDecodeError on a bad body."""
    return json.loads(to_text(data))


def parse_json_body(body):
    """A JSON object body as a dict, or None (empty, not JSON, not an object)."""
    if not body:
        return None
    try:
        data = decode_json(body)
    except (ValueError, UnicodeDecodeError):
        return None
    return data if isinstance(data, dict) else None


def parse_retry_after(headers):
    """Seconds from a Retry-After header (any case), or None."""
    if not isinstance(headers, dict):
        return None
    for key, value in headers.items():
        if to_text(key).lower() == 'retry-after':
            try:
                return float(to_text(value).strip())
            except (TypeError, ValueError):
                return None
    return None
