from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import max_length, panel_schema
from .constants import COLOR_MODES, DEFAULTS, GROUP, MAX_TEMPLATE, PANEL_ID, STEPS, STYLES, SWITCH

SETTINGS = (SWITCH,)

SCHEMA = panel_schema(
    DEFAULTS,
    choices={'style': STYLES, 'step': STEPS, 'color_mode': COLOR_MODES},
    normalizers={'template': max_length(MAX_TEMPLATE)},
)

__all__ = ('GROUP', 'PANEL_ID', 'SCHEMA', 'SETTINGS', 'SWITCH')
