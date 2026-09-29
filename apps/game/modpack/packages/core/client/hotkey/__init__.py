from __future__ import absolute_import, division, print_function, unicode_literals

from ...hooks import subscribe, unsubscribe
from ...log import safe
from .constants import EITHER_SIDE


def _held(big_world, keys, name):
    """True while the modifier `name` is down on either side of the keyboard (Keys.KEY_LCONTROL or KEY_RCONTROL)."""
    for side in (name, EITHER_SIDE.get(name)):
        code = getattr(keys, side, None) if side else None
        if code is not None and big_world.isKeyDown(code):
            return True
    return False


def _repeated(event):
    # RU 1.45 BigWorld.KeyEvent.isRepeatedEvent(): a held key sends onKeyDown again; a toggle would flicker.
    check = getattr(event, 'isRepeatedEvent', None)
    return bool(check()) if check is not None else False


class Hotkey(object):
    """Calls `on_press()` when the key named `key` (a `Keys` name, KEY_T) goes down while every key of `modifiers`
    is held (a left-hand Ctrl, Shift or Alt also on the right), through the game's own InputHandler.onKeyDown (hangar and battle). A held key's auto-repeat does not press it
    again. `install()` / `remove()` are idempotent."""

    def __init__(self, key, modifiers, on_press):
        self.key = key
        self.modifiers = tuple(modifiers or ())
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

    def _on_key_down(self, event):
        import BigWorld
        import Keys
        if not self.key or getattr(event, 'key', None) != getattr(Keys, self.key, None) or _repeated(event):
            return
        if all(_held(BigWorld, Keys, name) for name in self.modifiers):
            self.on_press()
