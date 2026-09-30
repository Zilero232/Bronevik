from __future__ import absolute_import, division, print_function, unicode_literals

GROUP = 'battle'
SWITCH = 'battle_moe_panel'
PANEL_ID = 'marks_panel'
# The hangar Tank card keeps the panel id of the former hangar_marks component, so its components.json section and
# the player's place of it survive the merge.
CARD_PANEL_ID = 'hangar_marks'
STYLES = ('compact', 'extended', 'minimal', 'custom')
HANGAR_STYLES = ('compact', 'extended')
STEPS = ('0.1', '0.5', '1')
COLOR_MODES = ('delta', 'mark', 'off')
MAX_TEMPLATE = 400

DEFAULTS = {
    'x': 372,
    'y': 60,
    'align_x': 'left',
    'align_y': 'top',
    'style': 'compact',
    'template': '',
    'show_targets': True,
    'show_battle': True,
    'show_step': True,
    'show_battles': True,
    'show_up': True,
    'alt_detail': True,
    'step': '0.5',
    'color_mode': 'delta',
    'show_battle_panel': True,
    'hangar_card': True,
    'hangar_style': 'compact',
    'show_trend': True,
    'trend_battles': 5,
    'max_entries': 100,
    'page_rows': 50,
    'show_tank_ratings': True,
    'show_mastery': True,
    'show_research': True,
}
LIMITS = {
    'max_entries': (10, 500),
    'trend_battles': (1, 50),
    'page_rows': (10, 200),
}
# The default places of older versions (x, y, align_x, align_y): a panel still at one moves to today's default.
RETIRED_PLACES = (
    (0, 120, 'center', 'top'),
    (208, 8, 'left', 'top'),
    (490, -6, 'left', 'bottom'),
)

CARD_DEFAULTS = {
    'x': 16,
    'y': 440,
    'align_x': 'left',
    'align_y': 'top',
}
