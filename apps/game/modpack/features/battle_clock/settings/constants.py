from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_clock'
PANEL_ID = 'battle_clock'
CLOCK_FORMATS = ('%H:%M', '%H:%M:%S', '%I:%M %p')
DATE_FORMATS = ('', '%d.%m', '%d.%m.%Y', '%Y-%m-%d')
MAX_TEMPLATE = 300

DEFAULTS = {
    'x': -128,
    'y': 4,
    'align_x': 'right',
    'align_y': 'top',
    'clock_format': '%H:%M',
    'date_format': '',
    'show_timer': True,
    'template': '',
    'replace_timer': False,
}
