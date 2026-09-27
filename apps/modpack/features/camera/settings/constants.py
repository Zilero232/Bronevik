from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import NATIVE, TRI_STATE

SWITCH = 'camera_tweaks'
GROUP = 'battle'

ZOOM_PRESETS = (NATIVE, 'x2_x8', 'x2_x16', 'x2_x25', 'x4_x25')

DEFAULTS = {
    'zoom_steps': NATIVE,
    'dynamic_camera': NATIVE,
    'horizontal_stabilization': NATIVE,
}

CHOICES = {
    'zoom_steps': ZOOM_PRESETS,
    'dynamic_camera': TRI_STATE,
    'horizontal_stabilization': TRI_STATE,
}
