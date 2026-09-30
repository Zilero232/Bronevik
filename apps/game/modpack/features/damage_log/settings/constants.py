from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_damage_log'
PANEL_ID = 'damage_log'
STYLES = ('full', 'compact', 'minimal', 'custom')
LOG_KINDS = ('all', 'dealt', 'received')
# Colour sets of the totals line (model PALETTES): the classic one, our graphite and gold, high contrast, colour-blind safe.
PALETTES = ('classic', 'graphite', 'contrast', 'colorblind')
MAX_TEMPLATE = 600

DEFAULTS = {
    'x': 232,
    'y': -6,
    'align_x': 'left',
    'align_y': 'bottom',
    'style': 'full',
    'keep_stock': False,
    'palette': 'graphite',
    'kind_icons': True,
    'template': '{dealt} | {blocked} | {assisted} | {received}',
    'show_log': True,
    'log_lines': 5,
    'log_kinds': 'all',
    'entry_template': '',
    'kind_colors': True,
    'color_damage': '',
    'color_assist': '',
    'color_blocked': '',
    'color_received': '',
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (250, -260, 'left', 'bottom'),
)
KIND_COLOR_KEYS = ('color_damage', 'color_assist', 'color_blocked', 'color_received')

LAST_HIT_PANEL_ID = 'last_hit'
LAST_HIT_DEFAULTS = {
    'x': 232,
    'y': -6,
    'align_x': 'left',
    'align_y': 'bottom',
    'font_size': 16,
    'enabled': True,
    'timeout_s': 5,
    'show_class': True,
    'template': '',
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
LAST_HIT_RETIRED_PLACES = (
    (0, -120, 'center', 'center'),
    (0, -180, 'center', 'center'),
    (0, 250, 'center', 'center'),
)
LAST_HIT_LIMITS = {
    'timeout_s': (1, 15),
}
