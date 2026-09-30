from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_arty_meter'
PANEL_ID = 'arty_meter'
GROUP = 'battle'

DEFAULTS = {
    'x': -372,
    'y': 60,
    'align_x': 'right',
    'align_y': 'top',
    'show_day': True,
    'show_always': False,
    'keep_battles': 100,
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, 60, 'center', 'top'),
    (8, -60, 'left', 'center'),
)
LIMITS = {'keep_battles': (10, 500)}
