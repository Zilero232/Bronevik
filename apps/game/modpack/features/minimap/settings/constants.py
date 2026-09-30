from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import NATIVE, TRI_STATE

SWITCH = 'minimap_tweaks'
GROUP = 'battle'

SIZES = (NATIVE, '0', '1', '2', '3', '4', '5')
TRANSPARENCIES = (NATIVE, '0', '20', '40', '60', '80')
VEHICLE_NAMES = (NATIVE, 'never', 'alt', 'always')

# The recommended client values (core.client.native.RecommendedSettingsComponent): the own and the 445 m view circles,
# tank names on Alt; size and transparency stay the game's.
DEFAULTS = {
    'size': NATIVE,
    'transparency': NATIVE,
    'vehicle_names': 'alt',
    'view_range': 'on',
    'max_view_range': 'on',
    'draw_range': 'off',
}

CHOICES = {
    'size': SIZES,
    'transparency': TRANSPARENCIES,
    'vehicle_names': VEHICLE_NAMES,
    'view_range': TRI_STATE,
    'max_view_range': TRI_STATE,
    'draw_range': TRI_STATE,
}
