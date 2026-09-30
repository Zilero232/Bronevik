"""The client side of the panel edit modifier: watches the game's own InputHandler key events (hangar and
battle), calls `on_change(held)` when the configured modifier goes down or up and `on_key()` after every key event."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....hooks import subscribe
from ....hud.modifier import DEFAULT_MODIFIER, is_held
from ....log import safe
from ...timer import Ticker
from .constants import RELEASE_POLL_S


def _is_down(name):
    import BigWorld
    import Keys
    code = getattr(Keys, name, None)
    return code is not None and bool(BigWorld.isKeyDown(code))


class ModifierWatch(object):

    def __init__(self, on_change, on_key):
        self.on_change = on_change
        self.on_key = on_key
        self.mode = DEFAULT_MODIFIER
        self.held = False
        self.installed = False
        self.poll = Ticker(RELEASE_POLL_S, self._on_poll)

    @safe
    def install(self):
        if self.installed:
            return True
        from gui import InputHandler
        for event in ('onKeyDown', 'onKeyUp'):
            if getattr(InputHandler.g_instance, event, None) is not None:
                subscribe(InputHandler.g_instance, event, self._on_key)
        self.installed = True
        return True

    def set_mode(self, mode):
        self.mode = mode or DEFAULT_MODIFIER
        self.check()

    def _on_key(self, *args):
        self.check()
        self.on_key()

    def _on_poll(self):
        self.check()
        return self.held

    @safe
    def check(self):
        held = is_held(self.mode, _is_down)
        if held == self.held:
            return
        self.held = held
        if held:
            self.poll.start()
        self.on_change(held)
