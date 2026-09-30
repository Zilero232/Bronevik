from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import panel_schema
from .constants import CHOICES, DEFAULTS, GROUP, LIMITS, PANEL_ID, RETIRED_PLACES, SWITCH  # noqa: F401

SETTINGS = (SWITCH,)
SCHEMA = panel_schema(DEFAULTS, choices=CHOICES, limits=LIMITS, retired=RETIRED_PLACES)
