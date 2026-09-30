from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_UP

SWITCH = 'battle_team_hp'
PANEL_ID = 'team_hp'
# full: bar pair with the score between; segments: a segment per tank; icons: class icons with a bar each; compact and
# minimal: numbers and score in one line; numbers and bars: the older one-part styles.
STYLES = ('full', 'segments', 'icons', 'compact', 'minimal', 'numbers', 'bars')
# Styles drawn under the stock score strip instead of in its place.
OVERLAY_STYLES = ('numbers',)
# Where a pinned strip that keeps the stock score strip sits: right under it (the stock strip's markers end about 60 design px
# down, RU 1.45 gui_battle VehicleMarkersList.as).
UNDER_STOCK_Y = 62
MAX_TEMPLATE = 400

DEFAULTS = {
    'x': 0,
    'y': 0,
    'align_x': 'center',
    'align_y': 'top',
    'style': 'full',
    'bar_width': 30,
    'icon_width': 3,
    'show_score': True,
    'show_diff': True,
    'ally_color': COLOR_UP,
    'enemy_color': COLOR_DOWN,
    'template': '',
    'replace_stock': True,
    'pinned': True,
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, 58, 'center', 'top'),
    (0, 4, 'center', 'top'),
)
