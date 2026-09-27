from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import hex_color, matching, max_length, panel_schema, sound_event
from .constants import DEFAULTS, ICON_PATH, MAX_PATH, MAX_TEXT, PANEL_ID, SWITCH

SETTINGS = (SWITCH,)

SCHEMA = panel_schema(
    DEFAULTS,
    limits={'icon_size': (16, 256), 'hide_after_s': (0, 60)},
    normalizers={
        'text': max_length(MAX_TEXT),
        'color': hex_color,
        'icon': matching(ICON_PATH, MAX_PATH),
        'sound_event': sound_event,
    },
)

__all__ = ('PANEL_ID', 'SCHEMA', 'SETTINGS', 'SWITCH')
