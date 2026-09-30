from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number
from ....core.native_settings import from_table, native_values
from .constants import (
    CAROUSEL_ROW_MODES,
    CAROUSEL_TILE_MODES,
    CAROUSEL_TYPE,
    DOUBLE_CAROUSEL_TYPE,
    EXTRA_ROWS,
    INTERFACE_SCALE,
    INTERFACE_SCALES,
    LEGACY_CAROUSEL_ROWS,
    MULTI_ROW_COUNT,
    SCALE_TOLERANCE,
)

FIELDS = {
    'carousel_rows': (CAROUSEL_TYPE, from_table(CAROUSEL_ROW_MODES)),
    'carousel_tiles': (DOUBLE_CAROUSEL_TYPE, from_table(CAROUSEL_TILE_MODES)),
}


def to_native(values):
    return native_values(values, FIELDS)


def normalize_rows(value):
    return LEGACY_CAROUSEL_ROWS.get(value, value)


def rows_override(choice):
    return int(choice) if choice in EXTRA_ROWS else None


def carousel_row_count(choice, stock):
    rows = rows_override(choice)
    if rows is None or not is_int(stock) or stock < MULTI_ROW_COUNT:
        return stock
    return rows


def scale_index(options, choice):
    wanted = INTERFACE_SCALES.get(choice)
    if wanted is None:
        return None
    for index, value in enumerate(options or ()):
        if is_number(value) and abs(value - wanted) <= SCALE_TOLERANCE:
            return index
    return None


def with_interface_scale(native, choice, options):
    index = scale_index(options, choice)
    if index is None:
        return native
    result = dict(native)
    result[INTERFACE_SCALE] = index
    return result
