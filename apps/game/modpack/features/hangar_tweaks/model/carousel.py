from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import from_table, native_values
from .constants import CAROUSEL_ROW_MODES, CAROUSEL_TILE_MODES, CAROUSEL_TYPE, DOUBLE_CAROUSEL_TYPE

FIELDS = {
    'carousel_rows': (CAROUSEL_TYPE, from_table(CAROUSEL_ROW_MODES)),
    'carousel_tiles': (DOUBLE_CAROUSEL_TYPE, from_table(CAROUSEL_TILE_MODES)),
}


def to_native(values):
    return native_values(values, FIELDS)
