from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_personal_missions'
PANEL_ID = 'personal_missions'
GROUP = 'hangar'

DEFAULTS = {
    'x': 20,
    'y': 160,
    'align_x': 'left',
    'align_y': 'top',
    'show_hangar': True,
    'show_battle': True,
    'show_conditions': True,
    'max_missions': 3,
}
LIMITS = {'max_missions': (1, 6)}
