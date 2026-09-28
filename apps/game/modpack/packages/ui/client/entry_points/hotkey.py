from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.hotkey import Hotkey as CoreHotkey
from ..constants import HOTKEY, HOTKEY_MODIFIERS


class Hotkey(CoreHotkey):
    def __init__(self, on_press):
        CoreHotkey.__init__(self, HOTKEY, HOTKEY_MODIFIERS, on_press)
