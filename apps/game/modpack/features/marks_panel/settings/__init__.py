from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import max_length, panel_schema
from .constants import (  # noqa: F401
    CARD_DEFAULTS,
    CARD_PANEL_ID,
    COLOR_MODES,
    DEFAULTS,
    GROUP,
    HANGAR_STYLES,
    LIMITS,
    MAX_TEMPLATE,
    PANEL_ID,
    RETIRED_PLACES,
    STEPS,
    STYLES,
    SWITCH,
)

SETTINGS = (SWITCH,)

SCHEMA = panel_schema(
    DEFAULTS,
    choices={'style': STYLES, 'step': STEPS, 'color_mode': COLOR_MODES, 'hangar_style': HANGAR_STYLES},
    limits=LIMITS,
    normalizers={'template': max_length(MAX_TEMPLATE)},
    retired=RETIRED_PLACES,
)
CARD_SCHEMA = panel_schema(CARD_DEFAULTS)
