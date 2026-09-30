from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_hit_log'
PANEL_ID = 'hit_log'
MAX_TEMPLATE = 600
TEMPLATE_KEYS = ('header_template', 'line_template', 'alt_line_template')
# Outcome colours (model OUTCOME_COLORS): the classic set, our graphite and gold, high contrast, colour-blind safe.
PALETTES = ('classic', 'graphite', 'contrast', 'colorblind')

DEFAULTS = {
    'x': -372,
    'y': 60,
    'align_x': 'right',
    'align_y': 'top',
    'show_header': True,
    'header_template': '',
    'line_template': '',
    'alt_mode': False,
    'alt_line_template': '',
    'lines': 6,
    'group_by_target': False,
    'palette': 'graphite',
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (-250, -260, 'right', 'bottom'),
    (-8, -320, 'right', 'bottom'),
    (-8, 40, 'right', 'top'),
)
