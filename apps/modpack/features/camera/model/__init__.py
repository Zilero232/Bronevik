"""Camera options the client itself offers, as client settings: which sniper zoom steps are used, the
dynamic camera and horizontal stabilisation.

Left out on purpose, pending a written MOST/Lesta confirmation (README "Camera"): extra zoom steps or
camera distance beyond the client's own options, free-look / pitch limits and the commander camera. All
of them need overriding the camera configuration (PMOD-style), which is not a setting the game exposes."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import from_table, native_values, tri_state
from .constants import DYNAMIC_CAMERA, HORIZONTAL_STABILIZATION, ZOOM_STEP_PRESETS, ZOOM_STEPS

FIELDS = {
    'zoom_steps': (ZOOM_STEPS, from_table(ZOOM_STEP_PRESETS)),
    'dynamic_camera': (DYNAMIC_CAMERA, tri_state),
    'horizontal_stabilization': (HORIZONTAL_STABILIZATION, tri_state),
}

CLIENT_SETTINGS = tuple(sorted(name for name, _ in FIELDS.values()))


def to_native(values):
    return native_values(values, FIELDS)
