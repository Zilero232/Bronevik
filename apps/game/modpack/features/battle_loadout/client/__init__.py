from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import ammo, optional_devices
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.log import safe
from ..i18n import STRINGS
from ..model import clean_devices, format_panel
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import equipment_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import DEVICE_EVENTS, SETUP_EVENT
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


# Read again whenever the client reports the descriptor's devices or a device's battle state changed, or a setup
# was switched before the battle. Only the equipment and the directives: the stock panel under the row shows the
# shells and the consumables.
class BattleLoadoutPanel(BattlePanel):

    def __init__(self, app):
        self.devices = []
        BattlePanel.__init__(self, app, PANEL_SPEC)

    def start(self, player):
        for name in DEVICE_EVENTS:
            self.hooks.add(optional_devices, name, self._on_loadout)
        self.hooks.add(ammo, SETUP_EVENT, self._on_loadout)
        self._on_loadout()

    def stop(self):
        self.devices = []

    def settings_changed(self, changed):
        self.render()

    def _on_loadout(self, *args):
        self.devices = clean_devices(own_loadout())
        self.render()

    @safe
    def render(self):
        if not self.devices:
            self.hide()
            return

        self.show(format_panel(self.devices, self.settings), equipment_widget(self.devices, self.settings))
