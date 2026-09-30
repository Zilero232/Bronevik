from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_received_hits'
PANEL_ID = 'received_hits'
GROUP = 'battle'
MAX_TEMPLATE = 300

DEFAULTS = {
    'x': 372,
    'y': 60,
    'align_x': 'left',
    'align_y': 'top',
    'show_header': True,
    'show_class': True,
    'show_shell': True,
    'lines': 5,
    'line_template': '',
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (208, 8, 'left', 'top'),
    (250, -120, 'left', 'bottom'),
)
LIMITS = {'lines': (0, 15)}
