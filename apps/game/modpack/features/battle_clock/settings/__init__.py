from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import max_length, panel_schema
from .constants import CLOCK_FORMATS, DATE_FORMATS, DEFAULTS, MAX_TEMPLATE, PANEL_ID, SWITCH

SETTINGS = (SWITCH,)

SCHEMA = panel_schema(
    DEFAULTS,
    choices={'clock_format': CLOCK_FORMATS, 'date_format': DATE_FORMATS},
    normalizers={'template': max_length(MAX_TEMPLATE)},
)

__all__ = ('PANEL_ID', 'SCHEMA', 'SETTINGS', 'SWITCH')
