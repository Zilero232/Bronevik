from __future__ import absolute_import, division, print_function, unicode_literals

from ...hud.surface import KIND_BUTTON
from ...log import log, safe
from ..hud import create_backend


class Ui(object):
    """Hangar panels and notifications for the companion and the hangar features: labels drawn through the HUD renderer
    chain (OpenWG Gameface or GUIFlash 0.6+), each placed by its own layout, and the game's system messages.
    `set_muted` and `set_blocked` (the streamer mode) take labels off the screen and bring them back later.
    A label is framed only while the player holds the edit modifier; `on_moved(props)` gets the new place
    (x, y, alignX, alignY or scale) after the player moved or resized it. `button()` puts a clickable button on
    the Gameface HUD page (only that renderer draws buttons)."""

    def __init__(self, backend=None):
        self.backend = backend or create_backend()
        self.components = set()
        self.moved = {}
        self.pressed = {}
        self.texts = {}
        self.muted = False
        self.blocked = frozenset()
        self.held = {}
        if not self.has_panels:
            log('no hangar HUD renderer: panels fall back to system messages')
        self.backend.listen(self._on_moved)
        self.backend.listen_press(self._on_pressed)

    @property
    def has_panels(self):
        return bool(self.backend.available())

    def suppressed(self, alias):
        return self.muted or alias in self.blocked

    @safe
    def show(self, alias, text, layout, on_moved=None):
        if not self.has_panels:
            return False
        if self.suppressed(alias):
            self._take_off(alias)
            self.held[alias] = (text, layout)
            return True
        self.held.pop(alias, None)
        self.texts[alias] = (text, layout)
        if on_moved is not None:
            self.moved[alias] = on_moved
        if alias in self.components:
            self.backend.update(alias, {'text': text, 'visible': True})
            return True
        props = {'border': False}
        props.update(layout)
        props.update({'text': text, 'drag': True, 'visible': True})
        if not self.backend.create(alias, props):
            self.texts.pop(alias, None)
            return False
        self.components.add(alias)
        return True

    @safe
    def button(self, alias, layout, on_press, on_moved=None):
        """A button panel on the Gameface HUD page; False (nothing drawn) with another renderer."""
        if alias in self.components:
            self.pressed[alias] = on_press
            return bool(self.backend.update(alias, {'visible': True}))
        if not self.has_panels or not self.backend.draws_buttons():
            return False
        props = dict(layout)
        props.update({'text': '', 'kind': KIND_BUTTON, 'drag': True, 'border': False, 'visible': True})
        if not self.backend.create(alias, props):
            return False
        self.components.add(alias)
        self.pressed[alias] = on_press
        if on_moved is not None:
            self.moved[alias] = on_moved
        return True

    def place(self, alias, layout):
        """Move a shown label or button to a new layout (a reset)."""
        if alias in self.components:
            self.backend.update(alias, dict(layout))

    def set_modifier(self, mode):
        self.backend.set_modifier(mode)

    def _on_moved(self, alias, props):
        callback = self.moved.get(alias)
        if callback is None:
            return False
        callback(props)
        return True

    def _on_pressed(self, alias):
        callback = self.pressed.get(alias)
        if callback is not None:
            callback()

    @safe
    def hide(self, alias):
        self.held.pop(alias, None)
        self._take_off(alias)

    def _take_off(self, alias):
        self.texts.pop(alias, None)
        if alias not in self.components:
            return
        self.backend.delete(alias)
        self.components.discard(alias)

    @safe
    def set_muted(self, muted):
        self.muted = bool(muted)
        self._apply()

    @safe
    def set_blocked(self, aliases):
        self.blocked = frozenset(aliases or ())
        self._apply()

    def _apply(self):
        for alias in list(self.components):
            if self.suppressed(alias) and alias not in self.pressed:
                if alias in self.texts:
                    self.held[alias] = self.texts[alias]
                self._take_off(alias)
        for alias, (text, layout) in list(self.held.items()):
            if not self.suppressed(alias):
                self.show(alias, text, layout)

    @safe
    def notify(self, text):
        from gui import SystemMessages
        SystemMessages.pushMessage(text, type=SystemMessages.SM_TYPE.Information)
