from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_info'
SECTION = 'hangar_info'
GROUP = 'hangar'
MAX_TEMPLATE = 300

CLOCK_FORMATS = ('%H:%M', '%H:%M:%S', '%I:%M %p')
DATE_FORMATS = ('', '%d.%m', '%d.%m.%Y', '%Y-%m-%d')
ALIGN_X = ('left', 'center', 'right')
ALIGN_Y = ('top', 'center', 'bottom')

# UNVERIFIED on Lesta 1.45: the strip's place just above the tank carousel takes the one-row carousel with its filter
# bar as about 190 design px tall.
DEFAULTS = {
    'clock_format': '%H:%M',
    'date_format': '%d.%m',
    'show_server': True,
    'show_ping': True,
    'show_online': True,
    'battle_clock': True,
    'battle_clock_format': '%H:%M',
    'replace_timer': False,
    'template': '',
    'font_size': 14,
    'x': 0,
    'y': -196,
    'align_x': 'left',
    'align_y': 'bottom',
    'scale': 100,
}

CHOICES = {
    'clock_format': CLOCK_FORMATS,
    'battle_clock_format': CLOCK_FORMATS,
    'date_format': DATE_FORMATS,
    'align_x': ALIGN_X,
    'align_y': ALIGN_Y,
}

LIMITS = {
    'font_size': (8, 48),
    'x': (-4000, 4000),
    'y': (-4000, 4000),
    'scale': (50, 300),
}

# The battle clock is a HUD panel of its own (its place in the `battle_clock` section, the id it had as a component of
# its own): right 8, top 46, under the stock timer (battleTimer, 184 x 44 at the top right).
CLOCK_PANEL_ID = 'battle_clock'
CLOCK_DEFAULTS = {
    'x': -8,
    'y': 46,
    'align_x': 'right',
    'align_y': 'top',
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
CLOCK_RETIRED_PLACES = (
    (-190, 4, 'right', 'top'),
    (-128, 4, 'right', 'top'),
    (-20, 8, 'right', 'top'),
    (-8, 44, 'right', 'top'),
)
