from __future__ import absolute_import, division, print_function, unicode_literals

import re

from ....core.hud import hex_color, matching, max_length, panel_schema
from .constants import DEFAULTS, MAX_PATH, MAX_SOUND, MAX_TEXT, PANEL_ID, SWITCH

SETTINGS = (SWITCH,)
SOUND_EVENT = re.compile(r'^[A-Za-z0-9_]*$')
ICON_PATH = re.compile(r'^[A-Za-z0-9_./-]*$')

SCHEMA = panel_schema(
    DEFAULTS,
    limits={'icon_size': (16, 256), 'hide_after_s': (0, 60)},
    normalizers={
        'text': max_length(MAX_TEXT),
        'color': hex_color,
        'icon': matching(ICON_PATH, MAX_PATH),
        'sound_event': matching(SOUND_EVENT, MAX_SOUND),
    },
)

__all__ = ('PANEL_ID', 'SCHEMA', 'SETTINGS', 'SWITCH')
