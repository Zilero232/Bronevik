"""The Gameface HUD page's side of the renderer: the labels as one JSON state, the page's messages back.

`HudSurface` keeps every label the layer created (GUIFlash props) with the GUI space it was created in, so
a hangar label never shows in battle and the other way round, as GUIFlash does. `encode(space, cursor, edit)`
is the view model's `state` property: `{v, cursor, edit, panels: [{id, text, x, y, align_x, align_y, alpha,
drag, border, visible, scale, kind, widget, dock}]}`; `widget` is a panel's structured payload (`core.hud.widget`)
or None, drawn instead of `text` when the page knows its kind; `dock` (`{group, order}` or None, `core.hud.panel.dock_of`)
stacks the panels of one column at its anchor. `edit` is true while the player holds the edit modifier (Alt by
default) and a cursor is shown: only then does a panel take the mouse, show its frame and move. The page
sends `{type: 'ready'}` once it can draw, `{type: 'moved', id, x, y, align_x, align_y}` after a drag,
`{type: 'resized', id, scale}` after the modifier + wheel, and `{type: 'pressed', id}` when the player
clicks a button panel. `handle(raw)` decodes one message; the ui-web side is `src/shared/api/hud-protocol`
(a test checks both command lists).
"""
from __future__ import absolute_import, division, print_function, unicode_literals

import json

from ...codec import canonical_json
from ...compat import is_number, string_types, to_text
from .constants import (ALIGN_X, ALIGN_Y, HUD_COMMANDS, HUD_MAX_MESSAGE_CHARS, HUD_MESSAGE_ARG, HUD_PROTOCOL_VERSION, HUD_RES_MAP_ID,
                        HUD_SEND_COMMAND, HUD_STATE_PROPERTY, KIND_BUTTON, KIND_LABEL, KINDS, PANEL_KEYS, POSITION_LIMIT, SCALE_LIMITS,
                        SPACE_BATTLE, SPACE_LOBBY)

__all__ = ('HUD_COMMANDS', 'HUD_MESSAGE_ARG', 'HUD_PROTOCOL_VERSION', 'HUD_RES_MAP_ID', 'HUD_SEND_COMMAND', 'HUD_STATE_PROPERTY',
           'HudSurface', 'KIND_BUTTON', 'KIND_LABEL', 'SPACE_BATTLE', 'SPACE_LOBBY', 'decode_hud_message')


def _position(value):
    if not is_number(value) or isinstance(value, bool):
        return None
    return max(-POSITION_LIMIT, min(POSITION_LIMIT, int(round(value))))


def _scale(value):
    if not is_number(value) or isinstance(value, bool):
        return None
    low, high = SCALE_LIMITS
    return round(max(low, min(high, float(value))), 2)


def _moved(message):
    x, y = _position(message.get('x')), _position(message.get('y'))
    if x is None or y is None:
        return None
    fields = {'x': x, 'y': y}
    if message.get('align_x') in ALIGN_X:
        fields['alignX'] = message['align_x']
    if message.get('align_y') in ALIGN_Y:
        fields['alignY'] = message['align_y']
    return fields


def _resized(message):
    scale = _scale(message.get('scale'))
    return {'scale': scale} if scale is not None else None


def _dock(value):
    if not isinstance(value, dict) or not isinstance(value.get('group'), string_types) or not is_number(value.get('order')):
        return None
    dock = {'group': to_text(value['group']), 'order': int(value['order'])}
    for key in ('reserve', 'ceiling', 'stop_center'):
        if is_number(value.get(key)):
            dock[key] = int(value[key])
    return dock


_FIELDS = {'moved': _moved, 'resized': _resized, 'pressed': lambda message: {}}


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
    reader = _FIELDS.get(command)
    if reader is None:
        return command, {}
    alias = message.get('id')
    fields = reader(message) if isinstance(alias, string_types) else None
    if fields is None:
        return None
    fields['id'] = to_text(alias)
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
        panel['scale'] = _scale(panel['scale']) or 1.0
        if panel['kind'] not in KINDS:
            panel['kind'] = KIND_LABEL
        if not isinstance(panel['widget'], dict):
            panel['widget'] = None
        panel['dock'] = _dock(panel['dock'])
        return panel

    def state(self, space, cursor, edit=False):
        cursor = bool(cursor)
        return {'v': HUD_PROTOCOL_VERSION, 'cursor': cursor, 'edit': cursor and bool(edit),
                'panels': [self.panel(alias) for alias in self.aliases(space)]}

    def encode(self, space, cursor, edit=False):
        return canonical_json(self.state(space, cursor, edit))

    def handle(self, raw):
        """Apply a page message: a drag or a resize changes the label here too. Returns the decoded (command, fields)
        or None."""
        decoded = decode_hud_message(raw)
        if decoded is None:
            return None
        command, fields = decoded
        if 'id' in fields:
            if fields['id'] not in self.labels:
                return None
            self.update(fields['id'], dict((key, value) for key, value in fields.items() if key != 'id'))
        return decoded
