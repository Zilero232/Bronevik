from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_loadout'
PANEL_ID = 'battle_loadout'
GROUP = 'battle'
STYLES = ('compact', 'detailed')

DEFAULTS = {
    'x': 0,
    'y': -200,
    'align_x': 'center',
    'align_y': 'bottom',
    'style': 'compact',
    'show_devices': True,
    'show_modifications': False,
    'show_directives': True,
    'show_icons': True,
    'icon_size': 24,
}
LIMITS = {'icon_size': (12, 48)}
