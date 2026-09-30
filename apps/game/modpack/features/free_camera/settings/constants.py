from __future__ import absolute_import, division, print_function, unicode_literals

from ..model.constants import HOTKEY_CHOICES

SWITCH = 'free_camera'
SECTION = 'free_camera'
GROUP = 'hangar'

DEFAULTS = {
    'hotkey': 'ctrl_shift_f',
    'in_replays': True,
    'in_hangar': True,
    'hide_ui': True,
}
CHOICES = {'hotkey': HOTKEY_CHOICES}
