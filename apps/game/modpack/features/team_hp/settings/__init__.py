from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import hex_color, max_length, panel_schema
from .constants import DEFAULTS, MAX_TEMPLATE, OVERLAY_STYLES, PANEL_ID, RETIRED_PLACES, STYLES, SWITCH, UNDER_STOCK_Y  # noqa: F401

SETTINGS = (SWITCH,)

SCHEMA = panel_schema(
    DEFAULTS,
    choices={'style': STYLES},
    limits={'bar_width': (5, 60), 'icon_width': (1, 8)},
    normalizers={'ally_color': hex_color, 'enemy_color': hex_color, 'template': max_length(MAX_TEMPLATE)},
    retired=RETIRED_PLACES,
)
