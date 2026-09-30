from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_efficiency'
PANEL_ID = 'battle_efficiency'
GROUP = 'battle'
MAX_TEMPLATE = 300

DEFAULTS = {
    'x': 372,
    'y': 60,
    'align_x': 'left',
    'align_y': 'top',
    'show_wn8': True,
    'show_damage': True,
    'colored': True,
    'template': '',
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (-20, 110, 'right', 'top'),
    (0, 60, 'center', 'top'),
)
