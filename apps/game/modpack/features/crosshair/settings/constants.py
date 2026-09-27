from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import NATIVE, TRI_STATE

SWITCH = 'crosshair_presets'
GROUP = 'battle'

PRESETS = (NATIVE, 'classic', 'minimal', 'contrast', 'clean')
MODES = ('both', 'arcade', 'sniper')

DEFAULTS = {
    'preset': NATIVE,
    'modes': 'both',
    'server_reticle': NATIVE,
}

CHOICES = {
    'preset': PRESETS,
    'modes': MODES,
    'server_reticle': TRI_STATE,
}
