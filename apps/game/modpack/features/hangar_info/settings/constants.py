from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_info'
SECTION = 'hangar_info'
GROUP = 'hangar'
MAX_TEMPLATE = 300

CLOCK_FORMATS = ('%H:%M', '%H:%M:%S', '%I:%M %p')
DATE_FORMATS = ('', '%d.%m', '%d.%m.%Y', '%Y-%m-%d')
ALIGN_X = ('left', 'center', 'right')
ALIGN_Y = ('top', 'center', 'bottom')

DEFAULTS = {
    'clock_format': '%H:%M:%S',
    'date_format': '%d.%m.%Y',
    'show_server': True,
    'show_ping': True,
    'show_online': True,
    'show_tiers': True,
    'show_crew': True,
    'show_training': True,
    'template': '',
    'font_size': 14,
    'x': -20,
    'y': 60,
    'align_x': 'right',
    'align_y': 'top',
}

CHOICES = {
    'clock_format': CLOCK_FORMATS,
    'date_format': DATE_FORMATS,
    'align_x': ALIGN_X,
    'align_y': ALIGN_Y,
}

LIMITS = {
    'font_size': (8, 48),
    'x': (-4000, 4000),
    'y': (-4000, 4000),
}
