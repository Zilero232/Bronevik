from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_consumables'
PANEL_ID = 'consumables'
GROUP = 'battle'

DEFAULTS = {
    'x': 0,
    'y': -66,
    'align_x': 'center',
    'align_y': 'bottom',
    'show_consumables': False,
    'show_shells': True,
    'show_shell_stats': False,
    'shell_stats': 'current',
}
CHOICES = {'shell_stats': ('current', 'all')}
