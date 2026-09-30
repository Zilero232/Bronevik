from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import max_length, panel_schema
from .constants import COLOR_MODES, DEFAULTS, GROUP, MAX_TEMPLATE, PANEL_ID, STYLES, SWITCH  # noqa: F401

SETTINGS = (SWITCH,)

SCHEMA = panel_schema(
    DEFAULTS,
    choices={'style': STYLES, 'color_mode': COLOR_MODES},
    normalizers={'template': max_length(MAX_TEMPLATE)},
)
