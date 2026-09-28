"""The Gameface HUD page's side of the renderer: the labels as one JSON state, the page's messages back.

`HudSurface` keeps every label the layer created (GUIFlash props) with the GUI space it was created in, so
a hangar label never shows in battle and the other way round, as GUIFlash does. `encode(space, cursor)` is
the view model's `state` property: `{v, cursor, panels: [{id, text, x, y, align_x, align_y, alpha, drag,
border, visible}]}`. The page sends `{type: 'ready'}` once it can draw, and `{type: 'moved', id, x, y,
align_x, align_y}` after the player dragged a label (only while the cursor is shown). `handle(raw)` decodes
one message; the ui-web side is `src/shared/api/hud-protocol` (a test checks both command lists).
"""
from __future__ import absolute_import, division, print_function, unicode_literals

import json

from ...codec import canonical_json
from ...compat import is_number, string_types, to_text
from .constants import (ALIGN_X, ALIGN_Y, HUD_COMMANDS, HUD_MAX_MESSAGE_CHARS, HUD_MESSAGE_ARG, HUD_PROTOCOL_VERSION, HUD_RES_MAP_ID,
                        HUD_SEND_COMMAND, HUD_STATE_PROPERTY, PANEL_KEYS, POSITION_LIMIT, SPACE_BATTLE, SPACE_LOBBY)

__all__ = ('HUD_COMMANDS', 'HUD_MESSAGE_ARG', 'HUD_PROTOCOL_VERSION', 'HUD_RES_MAP_ID', 'HUD_SEND_COMMAND', 'HUD_STATE_PROPERTY',
           'HudSurface', 'SPACE_BATTLE', 'SPACE_LOBBY', 'decode_hud_message')


def _position(value):
    if not is_number(value) or isinstance(value, bool):
        return None
    return max(-POSITION_LIMIT, min(POSITION_LIMIT, int(round(value))))


def decode_hud_message(raw):
    """(command, fields) of a page message, or None when it is not the protocol."""
    if not isinstance(raw, string_types) or len(raw) > HUD_MAX_MESSAGE_CHARS:
        return None
    try:
        message = json.loads(to_text(raw))
    except ValueError:
        return None
    if not isinstance(message, dict) or message.get('type') not in HUD_COMMANDS:
        return None
    command = message['type']
    if command != 'moved':
        return command, {}
    alias, x, y = message.get('id'), _position(message.get('x')), _position(message.get('y'))
    if not isinstance(alias, string_types) or x is None or y is None:
        return None
    fields = {'id': to_text(alias), 'x': x, 'y': y}
    if message.get('align_x') in ALIGN_X:
        fields['alignX'] = message['align_x']
    if message.get('align_y') in ALIGN_Y:
        fields['alignY'] = message['align_y']
    return command, fields


class HudSurface(object):

    def __init__(self):
        self.labels = {}
        self.order = []

    def create(self, alias, props, space):
        if alias not in self.labels:
            self.order.append(alias)
        self.labels[alias] = {'props': dict(props or {}), 'space': space}

    def update(self, alias, props):
        label = self.labels.get(alias)
        if label is None:
            return False
        label['props'].update(props or {})
        return True

    def delete(self, alias):
        if self.labels.pop(alias, None) is None:
            return False
        self.order.remove(alias)
        return True

    def has(self, alias):
        return alias in self.labels

    def aliases(self, space):
        return [alias for alias in self.order if self.labels[alias]['space'] == space]

    def panel(self, alias):
        props = self.labels[alias]['props']
        panel = {'id': alias}
        for prop, key, default in PANEL_KEYS:
            value = props.get(prop, default)
            panel[key] = value if value is not None else default
        panel['text'] = to_text(panel['text'])
        return panel

    def state(self, space, cursor):
        return {'v': HUD_PROTOCOL_VERSION, 'cursor': bool(cursor), 'panels': [self.panel(alias) for alias in self.aliases(space)]}

    def encode(self, space, cursor):
        return canonical_json(self.state(space, cursor))

    def handle(self, raw):
        """Apply a page message: a drag moves the label here too. Returns the decoded (command, fields) or None."""
        decoded = decode_hud_message(raw)
        if decoded is None:
            return None
        command, fields = decoded
        if command == 'moved':
            if fields['id'] not in self.labels:
                return None
            self.update(fields['id'], dict((key, value) for key, value in fields.items() if key != 'id'))
        return decoded
