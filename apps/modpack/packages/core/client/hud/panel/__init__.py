from __future__ import absolute_import, division, print_function, unicode_literals

from ....hud import HudPreview
from ...battle import BattleHooks
from ...component import FeatureComponent
from .. import hud_layer


class BattlePanel(FeatureComponent):
    """A battle HUD panel of the shared HUD layer. `start(*args)` runs on `start_event` (the player's own
    battle, never a replay) when the switch is on, `stop()` on `battle_leave` and before every start;
    subscriptions made through `self.hooks` are removed and the panel is hidden then. `preview_text()` is
    the sample the HUD editor and the hangar preview show: `preview(settings, translate)` unless overridden."""

    start_event = 'battle_ready'

    def __init__(self, app, panel_id, schema, switch, strings, preview_size, preview=None):
        self.hud = hud_layer(app)
        self.preview_source = preview
        FeatureComponent.__init__(self, app, panel_id, schema, switch, strings)
        self.hooks = BattleHooks()
        self.preview = HudPreview(self.hud, panel_id, self.preview_text, self.enabled, self._in_hangar, preview_size).attach(app.bus)
        app.bus.on(self.start_event, self._on_start)
        app.bus.on('battle_leave', self._on_leave)

    def register(self, schema):
        return self.hud.register(self.component_id, schema)

    def _in_hangar(self):
        return not self.app.in_battle

    def _on_start(self, *args):
        self._on_leave()
        if self.enabled():
            self.start(*args)

    def _on_leave(self):
        self.preview.end()
        self.hooks.clear()
        self.stop()
        self.hide()

    def show(self, text):
        return self.hud.show(self.component_id, text)

    def hide(self):
        self.hud.hide(self.component_id)

    def start(self, *args):
        pass

    def stop(self):
        pass

    def preview_text(self):
        return self.preview_source(self.settings, self.app.translate) if self.preview_source is not None else ''
