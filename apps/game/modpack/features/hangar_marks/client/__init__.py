from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.client.game import selected_vehicle
from ....core.client.hud import hud_layer
from ....core.client.moe import moe_service
from ....core.hooks import subscribe
from ....core.hud import EVENT_EDIT, HudPreview
from ....core.log import log_exception, safe
from ..i18n import STRINGS
from ..model import format_panel, hangar_state
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH


class HangarMarks(FeatureComponent):
    """The marks of the tank selected in the hangar, a HUD panel of its own (movable in the HUD editor)."""

    def __init__(self, app):
        self.hud = hud_layer(app)
        self.moe = moe_service(app)
        self.selected = None
        FeatureComponent.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS)
        self.preview = HudPreview(self.hud, PANEL_ID, self.preview_text, self.enabled, self.enabled_in_hangar, PREVIEW_SIZE).attach(app.bus)
        bus = app.bus
        bus.on('vehicle_moe', self._on_vehicle_moe)
        bus.on('hangar', self.render)
        bus.on('battle_enter', self._on_battle_enter)
        bus.on('component_settings', self._on_settings)
        bus.on(EVENT_EDIT, self._on_edit)
        self.moe.listen(self._on_curve)
        try:
            from CurrentVehicle import g_currentVehicle
            subscribe(g_currentVehicle, 'onChanged', self._on_vehicle_changed)
        except Exception:
            log_exception('hangar marks: current vehicle')

    def register(self, schema):
        return self.hud.register(self.component_id, schema)

    def preview_text(self):
        return preview_text(self.settings, self.app.translate)

    def _on_vehicle_moe(self, snapshot):
        self.selected = snapshot.get('tank_id')
        self.moe.ensure(self.selected)
        self.render()

    def _on_vehicle_changed(self):
        self.selected = getattr(selected_vehicle(), 'intCD', None)
        self.render()

    def _on_curve(self, tank_id):
        if tank_id == self.selected:
            self.render()

    def _on_settings(self, component_id, changed):
        if component_id == PANEL_ID:
            self.render()

    def _on_edit(self, active):
        if not active:
            self.render()

    def _on_battle_enter(self):
        self.preview.end()
        self.hide()

    def hide(self):
        self.hud.hide(PANEL_ID)

    @safe
    def render(self):
        if not self.enabled_in_hangar() or self.preview.previewing:
            if not self.preview.previewing:
                self.hide()
            return
        snapshot = self.moe.snapshot(self.selected) if self.selected is not None else None
        if snapshot is None:
            self.hide()
            return
        state = hangar_state(snapshot, self.moe.curve(self.selected), self.moe.pace(self.selected))
        self.hud.show(PANEL_ID, format_panel(state, self.settings, self.app.translate))
