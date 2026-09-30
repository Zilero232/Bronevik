from __future__ import absolute_import, division, print_function, unicode_literals

import re

from ....core.format import COLOR_WARN

SWITCH = 'battle_sixth_sense'
PANEL_ID = 'sixth_sense'
MAX_TEXT = 120
MAX_PATH = 200
ICON_PATH = re.compile(r'^[A-Za-z0-9_./-]*$')
# 'custom' shows `icon` (any client image path, empty = the text); the others are the icons the package ships.
ICON_SETS = ('custom', 'lamp', 'eye', 'badge', 'marks')

DEFAULTS = {
    'x': -66,
    'y': -182,
    'align_x': 'center',
    'align_y': 'center',
    'font_size': 22,
    'text': '',
    'color': COLOR_WARN,
    'icon_set': 'lamp',
    'icon': '',
    'icon_size': 56,
    'pulse': True,
    'show_timer': True,
    'hide_after_s': 0,
    'replace_stock': True,
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, 170, 'center', 'top'),
)

CHOICES = {'icon_set': ICON_SETS}
