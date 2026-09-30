from __future__ import absolute_import, division, print_function, unicode_literals

PLACE_HANGAR = 'hangar'
PLACE_REPLAY = 'replay'
PLACE_SWITCHES = {PLACE_HANGAR: 'in_hangar', PLACE_REPLAY: 'in_replays'}

START = 'start'
STOP = 'stop'

HOTKEYS = {
    'none': (None, ()),
    'ctrl_shift_f': ('KEY_F', ('KEY_LCONTROL', 'KEY_LSHIFT')),
    'ctrl_f3': ('KEY_F3', ('KEY_LCONTROL',)),
    'f7': ('KEY_F7', ()),
    'f8': ('KEY_F8', ()),
}
HOTKEY_CHOICES = ('ctrl_shift_f', 'ctrl_f3', 'f7', 'f8', 'none')
