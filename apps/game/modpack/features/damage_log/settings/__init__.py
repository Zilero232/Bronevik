from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import hex_color, max_length, panel_schema
from .constants import (DEFAULTS, KIND_COLOR_KEYS, LAST_HIT_DEFAULTS, LAST_HIT_LIMITS, LAST_HIT_PANEL_ID, LAST_HIT_RETIRED_PLACES,
                        LOG_KINDS, MAX_TEMPLATE, PALETTES, PANEL_ID, RETIRED_PLACES, STYLES, SWITCH, TEMPLATE_KEYS)

SETTINGS = (SWITCH,)

NORMALIZERS = dict((key, max_length(MAX_TEMPLATE)) for key in TEMPLATE_KEYS)
NORMALIZERS.update((key, hex_color) for key in KIND_COLOR_KEYS)

SCHEMA = panel_schema(
    DEFAULTS,
    choices={'style': STYLES, 'log_kinds': LOG_KINDS, 'palette': PALETTES},
    limits={'log_lines': (0, 15)},
    normalizers=NORMALIZERS,
    retired=RETIRED_PLACES,
)

# The last-hit pop-up is a panel of its own (movable, its own card); it runs while the damage log's switch is on.
LAST_HIT_SCHEMA = panel_schema(LAST_HIT_DEFAULTS, limits=LAST_HIT_LIMITS, normalizers={'template': max_length(MAX_TEMPLATE)},
                               retired=LAST_HIT_RETIRED_PLACES)

__all__ = ('LAST_HIT_PANEL_ID', 'LAST_HIT_SCHEMA', 'PANEL_ID', 'SCHEMA', 'SETTINGS', 'SWITCH')
