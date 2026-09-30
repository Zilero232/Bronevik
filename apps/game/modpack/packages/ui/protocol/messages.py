from __future__ import absolute_import, division, print_function, unicode_literals

import json

from ...core.codec import canonical_json
from ...core.compat import string_types, to_text
from ...core.errors import ReasonError
from .constants import COMMANDS, MAX_MESSAGE_CHARS, PROTOCOL_VERSION, REQUIRED


class ProtocolError(ReasonError):
    pass


def decode_message(raw):
    if not isinstance(raw, string_types):
        raise ProtocolError('not_text')
    text = to_text(raw)
    if len(text) > MAX_MESSAGE_CHARS:
        raise ProtocolError('too_large')
    try:
        message = json.loads(text)
    except ValueError:
        raise ProtocolError('not_json')
    if not isinstance(message, dict):
        raise ProtocolError('not_object')
    kind = message.get('type')
    if kind not in COMMANDS:
        raise ProtocolError('unknown_type')
    missing = [key for key in REQUIRED.get(kind, ()) if key not in message]
    if missing:
        raise ProtocolError('missing_' + missing[0])
    return message


def encode_state(state):
    payload = dict(state)
    payload['v'] = PROTOCOL_VERSION
    return canonical_json(payload)


def encode_feed(message):
    payload = dict(message)
    payload['v'] = PROTOCOL_VERSION
    return canonical_json(payload)
