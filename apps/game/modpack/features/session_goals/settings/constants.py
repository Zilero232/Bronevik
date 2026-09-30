from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_session_goals'
PANEL_ID = 'session_goals'
GROUP = 'hangar'

DEFAULTS = {
    'x': -372,
    'y': 60,
    'align_x': 'right',
    'align_y': 'top',
    'show_hangar': True,
    'show_battle': False,
    'sound': True,
    'max_goals': 3,
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, 60, 'center', 'top'),
    (20, 20, 'left', 'center'),
)
LIMITS = {
    'max_goals': (1, 5),
}
