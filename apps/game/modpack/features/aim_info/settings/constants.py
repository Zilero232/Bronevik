from __future__ import absolute_import, division, print_function, unicode_literals

from ..model.constants import PLACEMENT_RETICLE, PLACEMENTS

SWITCH = 'battle_aim_info'
SECTION = 'aim_info'
PANEL_ID = SECTION
GROUP = 'battle'

# The aim circle scale is off by default: it redraws what the client draws, so it waits for the player (and for
# the answer of the MOST catalogue on grey features, docs/ops/most-publishing.md). The armour readout is on: it
# only writes out the numbers of the client's own shot-result resolution (the marker colour).
DEFAULTS = {
    'x': 0,
    'y': 132,
    'align_x': 'center',
    'align_y': 'center',
    'target_distance': True,
    'shell_tooltips': True,
    'aim_circle': False,
    'aim_circle_scale': 70,
    'armor_under_aim': False,
    'show_nominal': True,
    'show_piercing': True,
    'show_angle': False,
    'placement': PLACEMENT_RETICLE,
    'arcade_offset': 132,
    'sniper_offset': 132,
    'strategic_offset': 100,
}

OFFSET_LIMITS = (-300, 300)
LIMITS = {
    'aim_circle_scale': (40, 100),
    'arcade_offset': OFFSET_LIMITS,
    'sniper_offset': OFFSET_LIMITS,
    'strategic_offset': OFFSET_LIMITS,
}
CHOICES = {'placement': PLACEMENTS}
