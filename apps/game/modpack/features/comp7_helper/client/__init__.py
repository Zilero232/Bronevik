from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import CardSpec, PolledHangarCard
from ....core.client.game import on_vehicle_changed
from ..i18n import STRINGS
from ..model import clean_state, format_hangar
from ..model.constants import HANGAR_LAYOUT, HANGAR_PANEL, REFRESH_EVERY_S
from ..model.widget import hangar_widget
from ..settings import SCHEMA, SECTION, SWITCH
from .reads import comp7_state

CARD_SPEC = CardSpec(
    section=SECTION,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    panel=HANGAR_PANEL,
    layout=HANGAR_LAYOUT,
    refresh_every_s=REFRESH_EVERY_S,
)


# The Onslaught hangar card: the own rating against the division thresholds and the role skill of the selected
# vehicle; read every REFRESH_EVERY_S in the hangar and when the vehicle changes, hidden outside Onslaught.
class Comp7Helper(PolledHangarCard):

    def __init__(self, app):
        PolledHangarCard.__init__(self, app, CARD_SPEC)
        on_vehicle_changed(self.refresh, 'comp7 helper')

    def render_card(self, translate):
        state = clean_state(comp7_state())
        text = format_hangar(state, self.settings, translate)
        return text, hangar_widget(state, self.settings, translate)
