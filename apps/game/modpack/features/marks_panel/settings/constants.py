from __future__ import absolute_import, division, print_function, unicode_literals

GROUP = 'battle'
SWITCH = 'battle_moe_panel'
PANEL_ID = 'marks_panel'
STYLES = ('extended', 'compact', 'minimal', 'custom')
STEPS = ('0.1', '0.5', '1')
COLOR_MODES = ('delta', 'mark', 'off')
MAX_TEMPLATE = 400

DEFAULTS = {
    'x': 0,
    'y': 120,
    'align_x': 'center',
    'align_y': 'top',
    'style': 'extended',
    'template': '',
    'show_targets': True,
    'show_battle': True,
    'show_step': True,
    'show_battles': True,
    'step': '0.5',
    'color_mode': 'delta',
}
