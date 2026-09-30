from __future__ import absolute_import, division, print_function, unicode_literals

from ..model.constants import PLACEMENT_RETICLE, PLACEMENTS

SWITCH = 'battle_gun_arc'
PANEL_ID = 'gun_arc'
GROUP = 'battle'

DEFAULTS = {
    'x': 0,
    'y': 96,
    'align_x': 'center',
    'align_y': 'center',
    'show_bar': True,
    'show_degrees': True,
    'warn_deg': 5,
    'show_yaw': True,
    'placement': PLACEMENT_RETICLE,
    'arcade_offset': 96,
    'sniper_offset': 96,
    'strategic_offset': 64,
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, 110, 'center', 'center'),
    (0, 190, 'center', 'center'),
)
OFFSET_LIMITS = (-300, 300)
LIMITS = {
    'warn_deg': (0, 30),
    'arcade_offset': OFFSET_LIMITS,
    'sniper_offset': OFFSET_LIMITS,
    'strategic_offset': OFFSET_LIMITS,
}
CHOICES = {'placement': PLACEMENTS}
