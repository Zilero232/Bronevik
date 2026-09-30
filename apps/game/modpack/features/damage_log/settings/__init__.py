from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud import hex_color, max_length, panel_schema
from .constants import (
    DEFAULTS,
    KIND_COLOR_KEYS,
    LIMITS,
    MAX_TEMPLATE,
    PALETTES,
    PANEL_ID,
    RETIRED_PLACES,
    SECTIONS,
    STYLES,
    SWITCH,
    TEMPLATE_KEYS,
)

SETTINGS = (SWITCH,)

NORMALIZERS = dict((key, max_length(MAX_TEMPLATE)) for key in TEMPLATE_KEYS)
NORMALIZERS.update((key, hex_color) for key in KIND_COLOR_KEYS)

SCHEMA = panel_schema(
    DEFAULTS,
    choices={'style': STYLES, 'sections': SECTIONS, 'palette': PALETTES},
    limits=LIMITS,
    normalizers=NORMALIZERS,
    retired=RETIRED_PLACES,
)

__all__ = ('PANEL_ID', 'SCHEMA', 'SETTINGS', 'SWITCH')
