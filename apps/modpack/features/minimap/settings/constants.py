from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import NATIVE, TRI_STATE

SWITCH = 'minimap_tweaks'
GROUP = 'battle'

SIZES = (NATIVE, '0', '1', '2', '3', '4', '5')
TRANSPARENCIES = (NATIVE, '0', '20', '40', '60', '80')
VEHICLE_NAMES = (NATIVE, 'never', 'alt', 'always')

DEFAULTS = {
    'size': NATIVE,
    'transparency': NATIVE,
    'vehicle_names': NATIVE,
    'view_range': NATIVE,
    'max_view_range': NATIVE,
    'draw_range': NATIVE,
}

CHOICES = {
    'size': SIZES,
    'transparency': TRANSPARENCIES,
    'vehicle_names': VEHICLE_NAMES,
    'view_range': TRI_STATE,
    'max_view_range': TRI_STATE,
    'draw_range': TRI_STATE,
}
