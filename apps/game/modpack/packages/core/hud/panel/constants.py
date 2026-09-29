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
    'scale': 100,
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
    'scale': (50, 300),
}

LAYOUT_KEYS = ('x', 'y', 'align_x', 'align_y', 'alpha', 'drag', 'border', 'scale')

HEX_COLOR = re.compile(r'^#[0-9A-Fa-f]{6}$')
SOUND_EVENT = re.compile(r'^[A-Za-z0-9_]*$')
MAX_SOUND_EVENT = 64

# The renderer's anchor props after a drag, and the settings keys they are saved to.
MOVED_ALIGNS = (('alignX', 'align_x'), ('alignY', 'align_y'))

# Renderer props only the Gameface HUD page draws; GUIFlash's Flash labels are never sent them.
GAMEFACE_PROPS = ('scale', 'kind')
