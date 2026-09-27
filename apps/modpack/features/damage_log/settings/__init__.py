from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import max_length, panel_schema
from .constants import DEFAULTS, LOG_KINDS, MAX_TEMPLATE, PANEL_ID, STYLES, SWITCH

SETTINGS = (SWITCH,)

SCHEMA = panel_schema(
    DEFAULTS,
    choices={'style': STYLES, 'log_kinds': LOG_KINDS},
    limits={'log_lines': (0, 15)},
    normalizers={'template': max_length(MAX_TEMPLATE), 'entry_template': max_length(MAX_TEMPLATE)},
)

__all__ = ('PANEL_ID', 'SCHEMA', 'SETTINGS', 'SWITCH')
