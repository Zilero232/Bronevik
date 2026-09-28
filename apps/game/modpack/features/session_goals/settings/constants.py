from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_session_goals'
PANEL_ID = 'session_goals'
GROUP = 'hangar'

DEFAULTS = {
    'x': 20,
    'y': 20,
    'align_x': 'left',
    'align_y': 'center',
    'show_hangar': True,
    'show_battle': True,
    'sound': True,
    'max_goals': 3,
}
LIMITS = {
    'max_goals': (1, 5),
}
