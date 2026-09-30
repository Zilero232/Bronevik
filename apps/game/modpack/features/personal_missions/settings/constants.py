from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_personal_missions'
PANEL_ID = 'personal_missions'
GROUP = 'hangar'

DEFAULTS = {
    'x': 0,
    'y': 60,
    'align_x': 'center',
    'align_y': 'top',
    'show_hangar': True,
    'show_battle': False,
    'show_conditions': True,
    'max_missions': 3,
}
LIMITS = {'max_missions': (1, 6)}
