from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import max_length, panel_schema
from .constants import DEFAULTS, GROUP, LIMITS, MAX_TEMPLATE, PANEL_ID, SWITCH

SETTINGS = (SWITCH,)
SCHEMA = panel_schema(DEFAULTS, limits=LIMITS, normalizers={'line_template': max_length(MAX_TEMPLATE)})

__all__ = ('GROUP', 'PANEL_ID', 'SCHEMA', 'SETTINGS', 'SWITCH')
