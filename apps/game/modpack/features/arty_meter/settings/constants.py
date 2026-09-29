from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_arty_meter'
PANEL_ID = 'arty_meter'
GROUP = 'battle'

DEFAULTS = {
    'x': 8,
    'y': -60,
    'align_x': 'left',
    'align_y': 'center',
    'show_day': True,
    'show_always': False,
    'keep_battles': 100,
}
LIMITS = {'keep_battles': (10, 500)}
