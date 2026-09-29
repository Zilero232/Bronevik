"""Structured panel payloads for the Gameface HUD page (protocol v3).

A panel is `{id, text, widget, ...}`: `text` stays the GUIFlash HTML, `widget` (`{kind, v, data}`, or None) is what the
Gameface page draws with its own component for `kind`. The page falls back to `text` when it does not know the kind or
the data fails its schema (`ui-web/src/entities/hud-widgets/<kind>`). Icon fields are strings from `core.hud.icons`.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import TONES, WIDGET_VERSION

__all__ = ('TONES', 'WIDGET_VERSION', 'tone', 'widget')


def widget(kind, data):
    return {'kind': kind, 'v': WIDGET_VERSION, 'data': data}


def tone(value, default='text'):
    """`value` when it is a known colour role, else `default`."""
    return value if value in TONES else default
