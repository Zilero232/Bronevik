from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_main_gun'
PANEL_ID = 'main_gun'
GROUP = 'battle'
MAX_TEMPLATE = 300

# The right top column (core/hud/panel DOCKS battle_right_top), off the stock team bases panel and quest progress the
# page keeps under the score strip.
DEFAULTS = {
    'x': -372,
    'y': 60,
    'align_x': 'right',
    'align_y': 'top',
    'show_team': True,
    'template': '',
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (-20, 60, 'right', 'top'),
    (0, 60, 'center', 'top'),
)
