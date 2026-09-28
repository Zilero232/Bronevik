from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import component_schema
from .constants import DEFAULTS, GROUP, LIMITS, SECTION, SWITCH

SETTINGS = (SWITCH,)
SCHEMA = component_schema(DEFAULTS, limits=LIMITS)

__all__ = ('GROUP', 'SCHEMA', 'SECTION', 'SETTINGS', 'SWITCH')
