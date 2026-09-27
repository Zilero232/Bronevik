"""GUIFlash (GambitER, MIT; optional runtime dependency, not bundled) as a HUD backend.

API used: `g_guiFlash.createComponent(alias, COMPONENT_TYPE.LABEL, props)`, `updateComponent(alias,
props)`, `deleteComponent(alias)` and `COMPONENT_EVENT.UPDATED(alias, props)`, which GUIFlash fires from
its `py_update` when the player drags a component (hold Ctrl for the cursor). GUIFlash was last updated
in 2024 and is unverified on Lesta 1.45.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....hud import HudBackend
from ....log import safe

try:
    from gui.mods.gambiter import g_guiFlash
    from gui.mods.gambiter.flash import COMPONENT_TYPE
except ImportError:
    g_guiFlash = None
    COMPONENT_TYPE = None

try:
    from gui.mods.gambiter.flash import COMPONENT_EVENT
except ImportError:
    COMPONENT_EVENT = None


class GuiFlashBackend(HudBackend):

    name = 'guiflash'

    def __init__(self):
        self.listener = None
        self.listening = False

    @classmethod
    def usable(cls):
        return g_guiFlash is not None and COMPONENT_TYPE is not None

    def available(self):
        return self.usable()

    @safe
    def create(self, alias, props):
        g_guiFlash.createComponent(alias, COMPONENT_TYPE.LABEL, dict(props))
        return True

    @safe
    def update(self, alias, props):
        g_guiFlash.updateComponent(alias, dict(props))
        return True

    @safe
    def delete(self, alias):
        g_guiFlash.deleteComponent(alias)
        return True

    @safe
    def listen(self, on_moved):
        self.listener = on_moved
        updated = getattr(COMPONENT_EVENT, 'UPDATED', None)
        if updated is None or self.listening:
            return
        updated += self._on_updated
        self.listening = True

    @safe
    def _on_updated(self, alias, props):
        if self.listener is not None:
            self.listener(alias, props if isinstance(props, dict) else {})
