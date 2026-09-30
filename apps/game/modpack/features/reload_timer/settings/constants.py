from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_reload_timer'
PANEL_ID = 'reload_timer'
GROUP = 'battle'
MAX_TEMPLATE = 200

DEFAULTS = {
    'x': 0,
    'y': 142,
    'align_x': 'center',
    'align_y': 'center',
    'show_bar': True,
    'show_ready': False,
    'show_clip': True,
    'template': '',
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, 70, 'center', 'center'),
)
