from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_hit_log'
PANEL_ID = 'hit_log'
MAX_TEMPLATE = 600
# Outcome colours (model OUTCOME_COLORS): the classic set, our graphite and gold, high contrast, colour-blind safe.
PALETTES = ('classic', 'graphite', 'contrast', 'colorblind')

DEFAULTS = {
    'x': -8,
    'y': -320,
    'align_x': 'right',
    'align_y': 'bottom',
    'show_header': True,
    'header_template': '',
    'line_template': '',
    'lines': 6,
    'group_by_target': False,
    'palette': 'graphite',
}
