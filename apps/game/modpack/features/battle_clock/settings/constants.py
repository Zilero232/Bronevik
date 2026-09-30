from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_clock'
PANEL_ID = 'battle_clock'
CLOCK_FORMATS = ('%H:%M', '%H:%M:%S', '%I:%M %p')
DATE_FORMATS = ('', '%d.%m', '%d.%m.%Y', '%Y-%m-%d')
MAX_TEMPLATE = 300

DEFAULTS = {
    'x': -190,
    'y': 4,
    'align_x': 'right',
    'align_y': 'top',
    'clock_format': '%H:%M',
    'date_format': '',
    'show_timer': True,
    'template': '',
    'replace_timer': False,
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (-128, 4, 'right', 'top'),
    (-20, 8, 'right', 'top'),
    (-8, 44, 'right', 'top'),
)
