from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_received_hits'
PANEL_ID = 'received_hits'
GROUP = 'battle'
MAX_TEMPLATE = 300

DEFAULTS = {
    'x': 208,
    'y': 8,
    'align_x': 'left',
    'align_y': 'top',
    'show_header': True,
    'show_class': True,
    'show_shell': True,
    'lines': 5,
    'line_template': '',
}
LIMITS = {'lines': (0, 15)}
