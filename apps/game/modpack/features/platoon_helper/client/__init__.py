from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import CardSpec, PolledHangarCard
from ..i18n import STRINGS
from ..model import OwnSession, clean_members, format_hangar
from ..model.constants import HANGAR_LAYOUT, HANGAR_PANEL, REFRESH_EVERY_S
from ..model.widget import hangar_widget
from ..settings import SCHEMA, SECTION, SWITCH
from .reads import platoon_members

CARD_SPEC = CardSpec(
    section=SECTION,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    panel=HANGAR_PANEL,
    layout=HANGAR_LAYOUT,
    refresh_every_s=REFRESH_EVERY_S,
)


# The hangar label of the platoon's ready marks (read every REFRESH_EVERY_S in the hangar) and the own platoon and clan
# battles of the session (`battle_event`).
class PlatoonHelper(PolledHangarCard):

    def __init__(self, app):
        self.session = OwnSession()
        PolledHangarCard.__init__(self, app, CARD_SPEC)
        bus = app.bus
        bus.on('battle_event', self._on_battle_event)
        bus.on('account', self._on_account)

    def _on_account(self, account_id):
        self.session = OwnSession()
        self.label.hide()

    def _on_battle_event(self, event, now):
        self.session.add(event, now)

    def render_card(self, translate):
        members = clean_members(platoon_members())
        text = format_hangar(members, self.session, self.settings, translate)
        return text, hangar_widget(members, self.session, self.settings, translate)
