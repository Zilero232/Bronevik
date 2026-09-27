from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import NATIVE

SWITCH = 'hangar_tweaks'
GROUP = 'hangar'

CAROUSEL_ROWS = (NATIVE, 'single', 'double')
CAROUSEL_TILES = (NATIVE, 'adaptive', 'small')

DEFAULTS = {
    'carousel_rows': NATIVE,
    'carousel_tiles': NATIVE,
    'quick_actions': True,
}

CHOICES = {
    'carousel_rows': CAROUSEL_ROWS,
    'carousel_tiles': CAROUSEL_TILES,
}
