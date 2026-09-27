from __future__ import absolute_import, division, print_function, unicode_literals

import re

from ....core.format import COLOR_WARN

SWITCH = 'battle_sixth_sense'
PANEL_ID = 'sixth_sense'
MAX_TEXT = 120
MAX_PATH = 200
ICON_PATH = re.compile(r'^[A-Za-z0-9_./-]*$')

DEFAULTS = {
    'x': 0,
    'y': 170,
    'align_x': 'center',
    'align_y': 'top',
    'font_size': 22,
    'text': '',
    'color': COLOR_WARN,
    'icon': '',
    'icon_size': 48,
    'sound_event': '',
    'show_timer': True,
    'hide_after_s': 0,
}
