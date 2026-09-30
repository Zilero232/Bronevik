from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import vehicle_class, vehicle_info
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.hud import HangarLabel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import build_page, clean_missions, format_battle, format_hangar
from ..model.constants import HANGAR_LAYOUT, HANGAR_PANEL, PREVIEW_SIZE, REFRESH_EVERY_S
from ..model.preview import preview_text, preview_widget
from ..model.widget import battle_widget, hangar_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import ACTION_REFRESH
from .reads import own_missions


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


# The personal missions in progress: a hangar label, the battle line of the missions of the tank's class (from the
# hangar snapshot: the battle client has no missions cache) and the list page in the mod window.
class PersonalMissionsPanel(BattlePanel):

    def __init__(self, app):
        self.missions = []
        self.totals = None
        self.hangar = HangarLabel(app, HANGAR_PANEL)
        self.read_at = 0.0
        BattlePanel.__init__(self, app, PANEL_SPEC)
        bus = app.bus
        bus.on('hangar', self.refresh)
        bus.on('tick', self._on_tick)
        bus.on('battle_enter', self.hangar.hide)

    def settings_changed(self, changed):
        self.hangar.hide()
        self.refresh()

    def _on_tick(self, now):
        if now - self.read_at >= REFRESH_EVERY_S:
            self.read_at = now
            self.refresh()

    @safe
    def refresh(self):
        if not self.enabled_in_hangar():
            self.hangar.clear()
            return
        self.missions, self.totals = clean_missions(own_missions())
        if not self.settings.get('show_hangar'):
            self.hangar.clear()
            return
        translate = self.app.translate

        text = format_hangar(self.missions, self.settings, translate, self.totals)
        widget = hangar_widget(self.missions, self.settings, translate, self.totals)
        self.hangar.show(text, HANGAR_LAYOUT, widget=widget)

    def start(self, player):
        if not self.settings.get('show_battle'):
            return
        vehicle_id = getattr(player, 'playerVehicleID', None)
        vehicle_type = getattr(vehicle_info(vehicle_id), 'vehicleType', None)
        level = getattr(vehicle_type, 'level', None)
        tank_class = vehicle_class(vehicle_id)
        translate = self.app.translate

        text = format_battle(self.missions, tank_class, self.settings, translate, level)
        if text:
            self.show(text, battle_widget(self.missions, tank_class, self.settings, translate, level))

    def ui_actions(self):
        if not self.enabled_in_hangar():
            return []
        return [{'id': ACTION_REFRESH, 'label': self.app.translate('pm_refresh'), 'confirm': None}]

    def ui_page(self):
        if not self.enabled_in_hangar():
            return None
        return build_page(self.missions, self.app.translate)

    def ui_action(self, action, row=None, value=None):
        if action == ACTION_REFRESH:
            self.refresh()
