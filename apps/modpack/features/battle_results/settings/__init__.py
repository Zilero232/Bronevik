from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import component_schema, max_length
from .constants import BONUS_TYPES, DEFAULTS, MAX_TEMPLATE, SECTION, SWITCH

SETTINGS = (SWITCH,)

SCHEMA = component_schema(
    DEFAULTS,
    choices={'bonus_types': BONUS_TYPES},
    normalizers={'template': max_length(MAX_TEMPLATE)},
)

__all__ = ('SCHEMA', 'SECTION', 'SETTINGS', 'SWITCH')
