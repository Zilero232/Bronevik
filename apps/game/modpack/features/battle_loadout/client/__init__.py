from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import ammo, optional_devices
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import clean_devices, format_panel, set_badges
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import equipment_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import DEVICE_EVENTS, SETUP_EVENT
from .reads import own_loadout


class BattleLoadoutPanel(BattlePanel):
    """The own vehicle's equipment and directives as icons over the stock consumables panel, read again whenever the
    client reports the descriptor's devices or a device's battle state changed, or a setup was switched before the
    battle."""

    def __init__(self, app):
        self.devices = []
        self.sets = {}
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)

    def start(self, player):
        for name in DEVICE_EVENTS:
            self.hooks.add(optional_devices, name, self._on_loadout)
        self.hooks.add(ammo, SETUP_EVENT, self._on_loadout)
        self._on_loadout()

    def stop(self):
        self.devices = []
        self.sets = {}

    def settings_changed(self, changed):
        self.render()

    def _on_loadout(self, *args):
        items, self.sets = own_loadout()
        self.devices = clean_devices(items)
        self.render()

    @safe
    def render(self):
        if not self.devices:
            self.hide()
            return

        badges = set_badges(self.sets, self.app.translate)
        text = format_panel(self.devices, badges, self.settings)
        self.show(text, equipment_widget(self.devices, badges, self.settings))
