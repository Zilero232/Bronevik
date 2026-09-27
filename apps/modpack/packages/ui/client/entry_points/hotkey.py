from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld
import Keys

from ....core.hooks import subscribe, unsubscribe
from ....core.log import safe
from ..constants import HOTKEY, HOTKEY_MODIFIERS


class Hotkey(object):
    """Ctrl+Shift+T through the client's InputHandler (hangar only; the callback decides)."""

    def __init__(self, on_press):
        self.on_press = on_press
        self.handler = None

    @safe
    def install(self):
        if self.handler is not None:
            return True
        from gui import InputHandler
        self.handler = subscribe(InputHandler.g_instance, 'onKeyDown', self._on_key_down)
        return True

    @safe
    def remove(self):
        if self.handler is not None:
            from gui import InputHandler
            unsubscribe(InputHandler.g_instance, 'onKeyDown', self.handler)
            self.handler = None

    @safe
    def _on_key_down(self, event):
        if getattr(event, 'key', None) != getattr(Keys, HOTKEY, None):
            return
        if all(BigWorld.isKeyDown(getattr(Keys, name)) for name in HOTKEY_MODIFIERS):
            self.on_press()
