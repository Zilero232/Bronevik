from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import max_length, panel_schema
from .constants import DEFAULTS, MAX_TEMPLATE, PALETTES, PANEL_ID, RETIRED_PLACES, SWITCH  # noqa: F401

SETTINGS = (SWITCH,)

SCHEMA = panel_schema(
    DEFAULTS,
    choices={'palette': PALETTES},
    limits={'lines': (0, 20)},
    normalizers={'header_template': max_length(MAX_TEMPLATE), 'line_template': max_length(MAX_TEMPLATE)},
    retired=RETIRED_PLACES,
)
