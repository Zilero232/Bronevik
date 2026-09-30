from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import ammo, arena, optional_devices, player
from ....core.client.hud.icons import client_file_exists
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.log import log, safe
from ..i18n import STRINGS
from ..model import clean_devices, format_panel, loadout_summary
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import equipment_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import DEVICE_EVENTS, PERIOD_EVENT, SETUP_EVENT, VEHICLE_UPDATED_EVENT
from .reads import own_loadout


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


# Read again whenever the client reports the descriptor's devices or a device's battle state changed, a setup was
# switched before the battle, the own vehicle's arena entry changed or the battle period moved on (the entry may come
# after the avatar is ready). Only the equipment and the directives: the stock panel under the row shows the shells
# and the consumables.
class BattleLoadoutPanel(BattlePanel):

    def __init__(self, app):
        self.devices = []
        self.summary = None
        BattlePanel.__init__(self, app, PANEL_SPEC)

    def start(self, avatar):
        for name in DEVICE_EVENTS:
            self.hooks.add(optional_devices, name, self._on_loadout)
        self.hooks.add(ammo, SETUP_EVENT, self._on_loadout)
        self.hooks.add(arena, VEHICLE_UPDATED_EVENT, self._on_vehicle_updated)
        self.hooks.add(arena, PERIOD_EVENT, self._on_loadout)
        self._on_loadout()

    def stop(self):
        self.devices = []
        self.summary = None

    def settings_changed(self, changed):
        self.render()

    def _on_vehicle_updated(self, vehicle_id, *args):
        if vehicle_id == getattr(player(), 'playerVehicleID', None):
            self._on_loadout()

    def _on_loadout(self, *args):
        loadout = own_loadout()
        self.devices = clean_devices(loadout['devices'] + loadout['directives'])
        self.wait(loadout['reason'])
        self._report(loadout)
        self.render()

    def _report(self, loadout):
        summary = loadout_summary(loadout, self.devices, client_file_exists)
        if summary != self.summary:
            self.summary = summary
            log(summary)

    @safe
    def render(self):
        if not self.devices:
            self.hide()
            return

        self.show(format_panel(self.devices, self.settings), equipment_widget(self.devices, self.settings))
