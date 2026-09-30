from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_consumables'
PANEL_ID = 'consumables'
GROUP = 'battle'

DEFAULTS = {
    'x': 0,
    'y': -64,
    'align_x': 'center',
    'align_y': 'bottom',
    'show_consumables': False,
    'show_shells': True,
    'show_shell_stats': False,
    'shell_stats': 'current',
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, -150, 'center', 'bottom'),
    (0, -66, 'center', 'bottom'),
)
CHOICES = {'shell_stats': ('current', 'all')}
