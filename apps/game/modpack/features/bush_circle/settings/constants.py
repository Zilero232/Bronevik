from __future__ import absolute_import, division, print_function, unicode_literals

from ..model.constants import COLOR_CHOICES, HOTKEY_CHOICES, MODES

SWITCH = 'battle_bush_circle'
SECTION = 'bush_circle'
GROUP = 'battle'

DEFAULTS = {
    'mode': 'hotkey',
    'hotkey': 'ctrl_shift_b',
    'color': 'white',
}

CHOICES = {
    'mode': MODES,
    'hotkey': HOTKEY_CHOICES,
    'color': COLOR_CHOICES,
}
