from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_gun_arc'
PANEL_ID = 'gun_arc'
GROUP = 'battle'

DEFAULTS = {
    'x': 0,
    'y': 190,
    'align_x': 'center',
    'align_y': 'center',
    'show_bar': True,
    'show_degrees': True,
    'warn_deg': 5,
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, 110, 'center', 'center'),
)
LIMITS = {'warn_deg': (0, 30)}
