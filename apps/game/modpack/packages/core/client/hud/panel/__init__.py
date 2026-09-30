from __future__ import absolute_import, division, print_function, unicode_literals

from ....hud import HudPreview
from ...battle import BattleHooks
from ...component import FeatureComponent
from .. import hud_layer, stock_control


class BattlePanel(FeatureComponent):
    """A battle HUD panel of the shared HUD layer. `start(*args)` runs on `start_event` (the player's own
    battle, never a replay) when the switch is on, `stop()` on `battle_leave` and before every start;
    subscriptions made through `self.hooks` are removed and the panel is hidden then. `preview_text()` is
    the sample the HUD editor and the hangar preview show: `preview(settings, translate)` unless overridden.

    `show(text, widget)` sends the GUIFlash text and the Gameface widget payload. A panel that replaces a stock element
    returns its aliases from `stock_aliases()`: they are hidden while the panel runs and the Gameface page draws widgets,
    and come back when the panel stops, is switched off or the renderer is GUIFlash."""

    start_event = 'battle_ready'

    def __init__(self, app, panel_id, schema, switch, strings, preview_size, preview=None, preview_widget=None):
        self.hud = hud_layer(app)
        self.stock = stock_control(app)
        self.preview_source = preview
        self.preview_widget_source = preview_widget
        self.running = False
        FeatureComponent.__init__(self, app, panel_id, schema, switch, strings)
        self.hooks = BattleHooks()
        self.preview = HudPreview(self.hud, panel_id, self.preview_text, self.enabled, self._in_hangar, preview_size,
                                  self.preview_widget).attach(app.bus)
        app.bus.on(self.start_event, self._on_start)
        app.bus.on('battle_leave', self._on_leave)

    def register(self, schema):
        return self.hud.register(self.component_id, schema)

    def _in_hangar(self):
        return not self.app.in_battle

    def _on_start(self, *args):
        self._on_leave()
        if self.enabled():
            self.running = True
            self.start(*args)
            self.sync_stock()

    def _on_leave(self):
        self.running = False
        self.preview.end()
        self.hooks.clear()
        self.stop()
        self.hide()
        self.sync_stock()

    def _on_component_settings(self, component_id, changed):
        if component_id != self.component_id:
            return
        if self.running and not self.enabled():
            self._on_leave()
        elif self.running:
            self.sync_stock()
        self.settings_changed(changed)

    def stock_aliases(self):
        """The stock battle elements this panel replaces with its current settings (`core.hud.stock` aliases)."""
        return ()

    def sync_stock(self):
        replaces = self.running and self.enabled() and self.hud.renders_widgets()
        self.stock.want(self.component_id, self.stock_aliases() if replaces else ())

    def show(self, text, widget=None):
        shown = self.hud.show(self.component_id, text, widget)
        self.sync_stock()
        return shown

    def hide(self):
        self.hud.hide(self.component_id)

    def show_text(self, text):
        """Show `text`, or hide the panel when it is empty."""
        if text:
            self.show(text)
        else:
            self.hide()

    def start(self, *args):
        pass

    def stop(self):
        pass

    def preview_text(self):
        return self.preview_source(self.settings, self.app.translate) if self.preview_source is not None else ''

    def preview_widget(self):
        """The widget the edit mode shows: `preview_widget(settings, translate)` unless overridden."""
        return self.preview_widget_source(self.settings, self.app.translate) if self.preview_widget_source is not None else None
