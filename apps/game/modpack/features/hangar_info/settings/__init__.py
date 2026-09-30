from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import component_schema, max_length, panel_schema
from .constants import (  # noqa: F401
    CHOICES,
    CLOCK_DEFAULTS,
    CLOCK_PANEL_ID,
    CLOCK_RETIRED_PLACES,
    DEFAULTS,
    GROUP,
    LIMITS,
    MAX_TEMPLATE,
    SECTION,
    SWITCH,
)

SETTINGS = (SWITCH,)
SCHEMA = component_schema(DEFAULTS, choices=CHOICES, limits=LIMITS, normalizers={'template': max_length(MAX_TEMPLATE)})
# The battle clock's panel section holds only its place; what it shows is set in this component's section.
CLOCK_SCHEMA = panel_schema(CLOCK_DEFAULTS, retired=CLOCK_RETIRED_PLACES)
