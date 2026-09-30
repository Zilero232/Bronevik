from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import optional_devices
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import clean_devices, format_panel
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import equipment_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .reads import own_devices


class BattleLoadoutPanel(BattlePanel):
    """The own vehicle's equipment as icons over the stock consumables panel, read from the battle's own vehicle descriptor
    and again whenever the client reports the descriptor's devices changed (RU 1.45 source: OptionalDevicesController
    onDescriptorDevicesChanged)."""

    def __init__(self, app):
        self.devices = []
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)

    def start(self, player):
        self.hooks.add(optional_devices, 'onDescriptorDevicesChanged', self._on_devices)
        self._on_devices()

    def stop(self):
        self.devices = []

    def settings_changed(self, changed):
        self.render()

    def _on_devices(self, *args):
        self.devices = clean_devices(own_devices())
        self.render()

    @safe
    def render(self):
        if self.devices:
            self.show(format_panel(self.devices, self.settings), equipment_widget(self.devices, self.settings))
        else:
            self.hide()
