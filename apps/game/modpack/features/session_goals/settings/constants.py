from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_session_goals'
PANEL_ID = 'session_goals'
GROUP = 'hangar'

DEFAULTS = {
    'x': 0,
    'y': 60,
    'align_x': 'center',
    'align_y': 'top',
    'show_hangar': True,
    'show_battle': False,
    'sound': True,
    'max_goals': 3,
}
LIMITS = {
    'max_goals': (1, 5),
}
