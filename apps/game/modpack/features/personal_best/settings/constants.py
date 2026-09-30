from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_personal_best'
PANEL_ID = 'personal_best'
GROUP = 'battle'
MAX_TEMPLATE = 300

DEFAULTS = {
    'x': 372,
    'y': 60,
    'align_x': 'left',
    'align_y': 'top',
    'show_damage': True,
    'show_assist': False,
    'show_frags': False,
    'show_card': True,
    'sound': True,
    'template': '',
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, 60, 'center', 'top'),
    (20, -40, 'left', 'center'),
)
