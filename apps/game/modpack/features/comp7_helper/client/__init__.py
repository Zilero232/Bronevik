from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.client.game import on_vehicle_changed
from ....core.hud import HangarLabel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import clean_state, format_hangar
from ..model.constants import HANGAR_LAYOUT, HANGAR_PANEL, REFRESH_EVERY_S
from ..model.widget import hangar_widget
from ..settings import SCHEMA, SECTION, SWITCH
from .reads import comp7_state


class Comp7Helper(FeatureComponent):
    """The Onslaught hangar card: the own rating against the division thresholds and the role skill of the selected
    vehicle; read every REFRESH_EVERY_S in the hangar and when the vehicle changes, hidden outside Onslaught."""

    def __init__(self, app):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.label = HangarLabel(app, HANGAR_PANEL)
        self.read_at = 0.0
        bus = app.bus
        bus.on('tick', self._on_tick)
        bus.on('hangar', self.refresh)
        bus.on('battle_enter', self.label.hide)
        on_vehicle_changed(self.refresh, 'comp7 helper')

    def settings_changed(self, changed):
        self.label.hide()
        self.refresh()

    def _on_tick(self, now):
        if now - self.read_at >= REFRESH_EVERY_S:
            self.read_at = now
            self.refresh()

    @safe
    def refresh(self):
        if not self.enabled_in_hangar():
            self.label.clear()
            return
        state = clean_state(comp7_state())
        translate = self.app.translate
        self.label.show(format_hangar(state, self.settings, translate), HANGAR_LAYOUT, widget=hangar_widget(state, self.settings, translate))
