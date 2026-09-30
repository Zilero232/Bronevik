from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import max_length, panel_schema
from .constants import DEFAULTS, GROUP, MAX_TEMPLATE, PANEL_ID, SWITCH  # noqa: F401

SETTINGS = (SWITCH,)
SCHEMA = panel_schema(DEFAULTS, normalizers={'template': max_length(MAX_TEMPLATE)})
