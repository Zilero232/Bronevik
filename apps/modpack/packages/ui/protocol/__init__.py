"""The window protocol: Python pushes the whole UI state as one JSON string property (`state`), the page
answers through one command (`send`) whose single argument is a JSON message with a `type`."""
from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import (BUTTON_MARKER, BUTTON_MARKER_VALUE, COMMANDS, GAMEFACE_ROOT, MESSAGE_ARG, PROTOCOL_VERSION, RES_MAP_BUTTON, RES_MAP_WINDOW,  # noqa: F401
                        SEND_COMMAND, STATE_PROPERTY)
from .messages import ProtocolError, decode_message, encode_state  # noqa: F401
