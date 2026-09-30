from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.client.game import on_vehicle_changed, selected_tank_id, vehicle_short_name
from ....core.client.hud import hud_layer
from ....core.client.lobby_view import lobby_view
from ....core.client.moe import moe_service
from ....core.hud import EVENT_EDIT, HudPreview
from ....core.log import safe
from ..i18n import STRINGS
from ..model import format_panel, hangar_state
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import hangar_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH


class HangarMarks(FeatureComponent):

    def __init__(self, app):
        self.hud = hud_layer(app)
        self.moe = moe_service(app)
        self.selected = None
        self.in_view = True
        FeatureComponent.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS)
        self.preview = HudPreview(
            self.hud,
            PANEL_ID,
            self.preview_text,
            self.enabled,
            self.enabled_in_hangar,
            PREVIEW_SIZE,
            self.preview_widget,
        ).attach(app.bus)
        bus = app.bus
        bus.on('vehicle_moe', self._on_vehicle_moe)
        bus.on('hangar', self.render)
        bus.on('battle_enter', self._on_battle_enter)
        bus.on(EVENT_EDIT, self._on_edit)
        self.moe.listen(self._on_curve)
        on_vehicle_changed(self._on_vehicle_changed, 'hangar marks')
        lobby_view().listen(self._on_view)

    def register(self, schema):
        return self.hud.register(self.component_id, schema)

    def preview_text(self):
        return preview_text(self.settings, self.app.translate)

    def preview_widget(self):
        return preview_widget(self.settings, self.app.translate)

    def _on_view(self, visible):
        self.in_view = visible
        self.render()

    def _on_vehicle_moe(self, snapshot):
        self.selected = snapshot.get('tank_id')
        self.moe.ensure(self.selected)
        self.render()

    def _on_vehicle_changed(self):
        self.selected = selected_tank_id()
        self.render()

    def _on_curve(self, tank_id):
        if tank_id == self.selected:
            self.render()

    def settings_changed(self, changed):
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
        if self.preview.previewing:
            return
        if not self.enabled_in_hangar() or not self.in_view:
            self.hide()
            return
        state = self._state()
        if state is None:
            self.hide()
            return

        translate = self.app.translate
        text = format_panel(state, self.settings, translate)
        widget = hangar_widget(state, self.settings, translate, vehicle_short_name(self.selected))
        self.hud.show(PANEL_ID, text, widget)

    def _state(self):
        if self.selected is None:
            return None
        snapshot = self.moe.snapshot(self.selected)
        if snapshot is None:
            return None
        return hangar_state(snapshot, self.moe.curve(self.selected), self.moe.pace(self.selected))
