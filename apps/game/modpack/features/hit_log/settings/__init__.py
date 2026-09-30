from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import max_length, panel_schema
from .constants import DEFAULTS, MAX_TEMPLATE, PALETTES, PANEL_ID, RETIRED_PLACES, SWITCH, TEMPLATE_KEYS  # noqa: F401

SETTINGS = (SWITCH,)

SCHEMA = panel_schema(
    DEFAULTS,
    choices={'palette': PALETTES},
    limits={'lines': (0, 20)},
    normalizers=dict((key, max_length(MAX_TEMPLATE)) for key in TEMPLATE_KEYS),
    retired=RETIRED_PLACES,
)
