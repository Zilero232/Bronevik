from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.hud import HangarLabel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import OwnSession, clean_members, format_hangar
from ..model.widget import hangar_widget
from ..model.constants import HANGAR_LAYOUT, HANGAR_PANEL, REFRESH_EVERY_S
from ..settings import SCHEMA, SECTION, SWITCH
from .reads import platoon_members


class PlatoonHelper(FeatureComponent):
    """The hangar label of the platoon's ready marks (read every REFRESH_EVERY_S in the hangar) and the own platoon and
    clan battles of the session (`battle_event`)."""

    def __init__(self, app):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.session = OwnSession()
        self.label = HangarLabel(app, HANGAR_PANEL)
        self.read_at = 0.0
        bus = app.bus
        bus.on('battle_event', self._on_battle_event)
        bus.on('tick', self._on_tick)
        bus.on('hangar', self.refresh)
        bus.on('battle_enter', self.label.hide)
        bus.on('account', self._on_account)

    def _on_account(self, account_id):
        self.session = OwnSession()
        self.label.hide()

    def _on_battle_event(self, event, now):
        self.session.add(event, now)

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
        members = clean_members(platoon_members())
        translate = self.app.translate
        self.label.show(format_hangar(members, self.session, self.settings, translate), HANGAR_LAYOUT,
                        widget=hangar_widget(members, self.session, self.settings, translate))
