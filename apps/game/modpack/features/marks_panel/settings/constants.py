from __future__ import absolute_import, division, print_function, unicode_literals

GROUP = 'battle'
SWITCH = 'battle_moe_panel'
PANEL_ID = 'marks_panel'
STYLES = ('extended', 'compact', 'minimal', 'custom')
STEPS = ('0.1', '0.5', '1')
COLOR_MODES = ('delta', 'mark', 'off')
MAX_TEMPLATE = 400

DEFAULTS = {
    'x': 372,
    'y': 60,
    'align_x': 'left',
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
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, 120, 'center', 'top'),
    (208, 8, 'left', 'top'),
    (490, -6, 'left', 'bottom'),
)
