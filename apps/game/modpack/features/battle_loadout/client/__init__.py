from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.game import player_tank_id
from ....core.client.hud.panel import BattlePanel
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.hooks import subscribe
from ....core.log import log_exception, safe
from ..i18n import STRINGS
from ..model import LoadoutBook, format_panel
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .reads import selected_loadout


class BattleLoadoutPanel(BattlePanel):
    """The own tank's equipment, field modifications and directives, read in the hangar when the vehicle is selected
    (the battle client has no gui items) and shown in the battle on that tank."""

    def __init__(self, app):
        self.book = LoadoutBook()
        self.loadout = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)
        app.bus.on('hangar', self._on_vehicle_changed)
        app.bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)
        try:
            from CurrentVehicle import g_currentVehicle
            subscribe(g_currentVehicle, 'onChanged', self._on_vehicle_changed)
        except Exception:
            log_exception('battle loadout: current vehicle')

    def _on_vehicle_changed(self):
        if not self.enabled_in_hangar():
            return
        tank_id, loadout = selected_loadout()
        if tank_id:
            self.book.put(tank_id, loadout)

    def _on_settings(self, component_id, changed):
        if component_id == PANEL_ID:
            self.render()

    def start(self, player):
        self.loadout = self.book.get(player_tank_id(player))
        self.render()

    def stop(self):
        self.loadout = None

    @safe
    def render(self):
        if self.loadout is None:
            return
        text = format_panel(self.loadout, self.settings, self.app.translate)
        if text:
            self.show(text)
        else:
            self.hide()
