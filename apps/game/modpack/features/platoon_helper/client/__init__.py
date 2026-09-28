from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.log import safe
from ..i18n import STRINGS
from ..model import OwnSession, clean_members, format_hangar
from ..model.constants import HANGAR_LAYOUT, HANGAR_PANEL, REFRESH_EVERY_S
from ..settings import SCHEMA, SECTION, SWITCH
from .reads import platoon_members


class PlatoonHelper(FeatureComponent):
    """The hangar label of the platoon's ready marks (read every REFRESH_EVERY_S in the hangar) and the own platoon and
    clan battles of the session (`battle_event`)."""

    def __init__(self, app):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.session = OwnSession()
        self.text = None
        self.read_at = 0.0
        bus = app.bus
        bus.on('battle_event', self._on_battle_event)
        bus.on('tick', self._on_tick)
        bus.on('hangar', self.refresh)
        bus.on('battle_enter', self._hide)
        bus.on('account', self._on_account)
        bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)

    def _on_account(self, account_id):
        self.session = OwnSession()
        self._hide()

    def _on_battle_event(self, event, now):
        self.session.add(event, now)

    def _on_settings(self, component_id, changed):
        if component_id == SECTION:
            self._hide()
            self.refresh()

    def _on_tick(self, now):
        if now - self.read_at >= REFRESH_EVERY_S:
            self.read_at = now
            self.refresh()

    def _hide(self):
        self.text = None
        self.app.ui.hide(HANGAR_PANEL)

    @safe
    def refresh(self):
        if not self.enabled_in_hangar():
            if self.text is not None:
                self._hide()
            return
        text = format_hangar(clean_members(platoon_members()), self.session, self.settings, self.app.translate)
        if text is None:
            if self.text is not None:
                self._hide()
            return
        if text != self.text and self.app.ui.show(HANGAR_PANEL, text, HANGAR_LAYOUT):
            self.text = text
