from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import panel_schema
from .constants import DEFAULTS, GROUP, PANEL_ID, SWITCH

SETTINGS = (SWITCH,)
SCHEMA = panel_schema(DEFAULTS)

__all__ = ('GROUP', 'PANEL_ID', 'SCHEMA', 'SETTINGS', 'SWITCH')
