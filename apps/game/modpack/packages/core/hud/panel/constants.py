from __future__ import absolute_import, division, print_function, unicode_literals

import re

ALIAS_PREFIX = 'otmetki.hud.'

PANEL_DEFAULTS = {
    'x': 0,
    'y': 0,
    'align_x': 'center',
    'align_y': 'top',
    'alpha': 100,
    'font_size': 14,
    'drag': True,
    'border': False,
}

PANEL_CHOICES = {
    'align_x': ('left', 'center', 'right'),
    'align_y': ('top', 'center', 'bottom'),
}

PANEL_LIMITS = {
    'x': (-4000, 4000),
    'y': (-4000, 4000),
    'alpha': (0, 100),
    'font_size': (8, 48),
}

LAYOUT_KEYS = ('x', 'y', 'align_x', 'align_y', 'alpha', 'drag', 'border')

HEX_COLOR = re.compile(r'^#[0-9A-Fa-f]{6}$')
SOUND_EVENT = re.compile(r'^[A-Za-z0-9_]*$')
MAX_SOUND_EVENT = 64
