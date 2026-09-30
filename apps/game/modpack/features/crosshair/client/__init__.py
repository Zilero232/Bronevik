from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import call, crosshair
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.client.native import apply_changed
from ..i18n import STRINGS
from ..model import mark_html, mark_offset, shows_in, to_native
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import VIEW_ARCADE, VIEW_SNIPER


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
)


# The presets are the player's client settings, written only on the player's change in the hangar; the centre mark
# follows the client's own reticle position (CrosshairDataProxy).
class CrosshairComponent(BattlePanel):

    def __init__(self, app):
        BattlePanel.__init__(self, app, PANEL_SPEC)
        self.view = None

    def desired(self):
        return to_native(self.settings.to_dict())

    def settings_changed(self, changed):
        if self.enabled_in_hangar():
            apply_changed(self.desired())

    def _in_hangar(self):
        return BattlePanel._in_hangar(self) and bool(self.mark())

    def mark(self):
        return mark_html(
            self.settings.get('mark'),
            self.settings.get('mark_size'),
            self.settings.get('mark_color'),
        )

    def start(self, player):
        if not self.mark():
            return
        self.view = call(crosshair(), 'getViewID')
        self.hooks.add(crosshair, 'onCrosshairViewChanged', self._on_view)
        self.hooks.add(crosshair, 'onCrosshairPositionChanged', self._on_position)
        self.hooks.add(crosshair, 'onCrosshairScaleChanged', self._on_position)
        self.render()

    def stop(self):
        self.view = None

    def _on_view(self, view):
        self.view = view
        self.render()

    def _on_position(self, *args):
        self.render()

    def render(self):
        ctrl = crosshair()
        if ctrl is None or not self._shows_in_current_view():
            self.hide()
            return
        if not self.show(self.mark()):
            return

        position = call(ctrl, 'getScaledPosition', (0, 0))
        size = call(ctrl, 'getSize', (0, 0))
        scale = call(ctrl, 'getScaleFactor', 1.0)
        x, y = mark_offset(position, size, scale, self.settings)
        self.hud.place(PANEL_ID, x, y)

    def _shows_in_current_view(self):
        return shows_in(self.settings.get('modes'), self.view == VIEW_ARCADE, self.view == VIEW_SNIPER)


def create_crosshair(app):
    return CrosshairComponent(app)
