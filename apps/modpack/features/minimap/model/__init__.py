"""The minimap options the client itself offers, as client settings. Deliberately absent (Lesta fair play):
lost-enemy markers, gun directions, arty tracers, destroyed objects, ally-spot markers, and zoom
beyond the client's own size range (that needs patching the Flash minimap)."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import NATIVE, from_table, native_values, tri_state
from .constants import DRAW_RANGE, MAX_VIEW_RANGE, SIZE, TRANSPARENCY, VEHICLE_NAME_MODES, VEHICLE_NAMES, VIEW_RANGE


def _number(value):
    return None if value == NATIVE else int(value)


FIELDS = {
    'size': (SIZE, _number),
    'transparency': (TRANSPARENCY, _number),
    'vehicle_names': (VEHICLE_NAMES, from_table(VEHICLE_NAME_MODES)),
    'view_range': (VIEW_RANGE, tri_state),
    'max_view_range': (MAX_VIEW_RANGE, tri_state),
    'draw_range': (DRAW_RANGE, tri_state),
}

CLIENT_SETTINGS = tuple(sorted(name for name, _ in FIELDS.values()))


def to_native(values):
    return native_values(values, FIELDS)
