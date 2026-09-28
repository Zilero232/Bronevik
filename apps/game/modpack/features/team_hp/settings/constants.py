from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_UP

SWITCH = 'battle_team_hp'
PANEL_ID = 'team_hp'
STYLES = ('full', 'numbers', 'bars', 'compact', 'icons')
MAX_TEMPLATE = 400

DEFAULTS = {
    'x': 0,
    'y': 58,
    'align_x': 'center',
    'align_y': 'top',
    'style': 'full',
    'bar_width': 30,
    'icon_width': 3,
    'show_score': True,
    'show_diff': True,
    'ally_color': COLOR_UP,
    'enemy_color': COLOR_DOWN,
    'template': '',
}
