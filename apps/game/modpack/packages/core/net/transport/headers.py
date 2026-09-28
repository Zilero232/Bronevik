from __future__ import absolute_import, division, print_function, unicode_literals

from ...compat import to_text


def _pairs(raw):
    if isinstance(raw, dict):
        return list(raw.items())
    if hasattr(raw, 'items'):
        try:
            return list(raw.items())
        except Exception:
            return []
    if isinstance(raw, (list, tuple)):
        return [pair for pair in raw if isinstance(pair, (list, tuple)) and len(pair) == 2]
    return []


def response_headers(response):
    """The headers of a client HTTP response as a {text name: text value} dict. RU 1.45 client source
    (gui/platform/base/request.py): `BigWorld.fetchURL` hands its callback a response whose `headers` is a
    method, `response.headers()`; a plain dict or a list of pairs is taken as well."""
    raw = getattr(response, 'headers', None)
    if hasattr(raw, '__call__'):
        try:
            raw = raw()
        except Exception:
            return {}
    headers = {}
    for key, value in _pairs(raw):
        try:
            headers[to_text(key)] = to_text(value)
        except (TypeError, ValueError, UnicodeDecodeError):
            continue
    return headers
