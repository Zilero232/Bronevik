from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import vehicle_class, vehicle_info
from ....core.client.hud.panel import BattlePanel
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.log import safe
from ..i18n import STRINGS
from ..model import build_page, clean_missions, format_battle, format_hangar
from ..model.constants import HANGAR_LAYOUT, HANGAR_PANEL, PREVIEW_SIZE, REFRESH_EVERY_S
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import ACTION_REFRESH
from .reads import own_missions


class PersonalMissionsPanel(BattlePanel):
    """The personal missions in progress: a hangar label, the battle line of the missions of the tank's class (from
    the hangar snapshot: the battle client has no missions cache) and the list page in the mod window."""

    def __init__(self, app):
        self.missions = []
        self.totals = None
        self.hangar_text = None
        self.read_at = 0.0
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)
        bus = app.bus
        bus.on('hangar', self.refresh)
        bus.on('tick', self._on_tick)
        bus.on('battle_enter', self._hide_hangar)
        bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)

    def _on_settings(self, component_id, changed):
        if component_id == PANEL_ID:
            self._hide_hangar()
            self.refresh()

    def _on_tick(self, now):
        if now - self.read_at >= REFRESH_EVERY_S:
            self.read_at = now
            self.refresh()

    def _hide_hangar(self):
        self.hangar_text = None
        self.app.ui.hide(HANGAR_PANEL)

    @safe
    def refresh(self):
        if not self.enabled_in_hangar():
            if self.hangar_text is not None:
                self._hide_hangar()
            return
        self.missions, self.totals = clean_missions(own_missions())
        text = format_hangar(self.missions, self.settings, self.app.translate, self.totals) if self.settings.get('show_hangar') else None
        if text is None:
            if self.hangar_text is not None:
                self._hide_hangar()
            return
        if text != self.hangar_text and self.app.ui.show(HANGAR_PANEL, text, HANGAR_LAYOUT):
            self.hangar_text = text

    def start(self, player):
        if not self.settings.get('show_battle'):
            return
        vehicle_id = getattr(player, 'playerVehicleID', None)
        level = getattr(getattr(vehicle_info(vehicle_id), 'vehicleType', None), 'level', None)
        text = format_battle(self.missions, vehicle_class(vehicle_id), self.settings, self.app.translate, level)
        if text:
            self.show(text)

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
        return None
