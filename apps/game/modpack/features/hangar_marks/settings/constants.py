from __future__ import absolute_import, division, print_function, unicode_literals

GROUP = 'hangar'
SWITCH = 'hangar_marks'
PANEL_ID = 'hangar_marks'
STYLES = ('extended', 'compact', 'custom')
COLOR_MODES = ('mark', 'off')
MAX_TEMPLATE = 400

DEFAULTS = {
    'x': -24,
    'y': 260,
    'align_x': 'right',
    'align_y': 'top',
    'style': 'extended',
    'template': '',
    'show_targets': True,
    'show_forecast': True,
    'color_mode': 'mark',
}
