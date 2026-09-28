from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import call, session_provider
from ....core.client.hud.panel import BattlePanel
from ....core.client.native import apply_changed
from ....core.events import EVENT_COMPONENT_SETTINGS
from ..i18n import STRINGS
from ..model import mark_html, mark_offset, shows_in, to_native
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import VIEW_ARCADE, VIEW_SNIPER


def crosshair_ctrl():
    return getattr(getattr(session_provider(), 'shared', None), 'crosshair', None)


class CrosshairComponent(BattlePanel):
    """The reticle presets (the player's client settings, written only on the player's change in the hangar) and
    the centre mark, a HUD label that follows the client's own reticle position (CrosshairDataProxy)."""

    def __init__(self, app):
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)
        self.view = None
        app.bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)

    def desired(self):
        return to_native(self.settings.to_dict())

    def _on_settings(self, component_id, changed):
        if component_id == self.component_id and self.enabled_in_hangar():
            apply_changed(self.desired())

    def _in_hangar(self):
        return BattlePanel._in_hangar(self) and bool(self.mark())

    def mark(self):
        return mark_html(self.settings.get('mark'), self.settings.get('mark_size'))

    def start(self, player):
        if not self.mark():
            return
        self.view = call(crosshair_ctrl(), 'getViewID')
        self.hooks.add(crosshair_ctrl, 'onCrosshairViewChanged', self._on_view)
        self.hooks.add(crosshair_ctrl, 'onCrosshairPositionChanged', self._on_position)
        self.hooks.add(crosshair_ctrl, 'onCrosshairScaleChanged', self._on_position)
        self.render()

    def stop(self):
        self.view = None

    def _on_view(self, view):
        self.view = view
        self.render()

    def _on_position(self, *args):
        self.render()

    def render(self):
        ctrl = crosshair_ctrl()
        if ctrl is None or not shows_in(self.settings.get('modes'), self.view == VIEW_ARCADE, self.view == VIEW_SNIPER):
            self.hide()
            return
        if not self.show(self.mark()):
            return
        position = call(ctrl, 'getScaledPosition', (0, 0))
        size = call(ctrl, 'getSize', (0, 0))
        x, y = mark_offset(position, size, call(ctrl, 'getScaleFactor', 1.0), self.settings)
        self.hud.place(PANEL_ID, x, y)


def create_crosshair(app):
    return CrosshairComponent(app)
