from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import shared
from ....core.client.battle.damage import DamageTracker
from ....core.client.battle.teams import TeamTracker
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.log import safe
from ..i18n import STRINGS
from ..model import format_panel, values
from ..model.constants import ALLY_HIT_MESSAGE, PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import panel_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH


def battle_messages():
    return shared('messages')


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


class MainGunPanel(BattlePanel):

    def __init__(self, app):
        self.tracker = TeamTracker(self.render)
        self.damage = DamageTracker(self.render)
        self.hit_ally = False
        BattlePanel.__init__(self, app, PANEL_SPEC)

    def start(self, player):
        self.hit_ally = False
        self.damage.start(self.hooks)
        self.hooks.add(battle_messages, 'onShowPlayerMessageByKey', self._on_player_message)
        self.tracker.start(self.hooks, player)

    def stop(self):
        self.tracker.stop()
        self.damage.stop()

    def _on_player_message(self, key, *args):
        if key == ALLY_HIT_MESSAGE and not self.hit_ally:
            self.hit_ally = True
            self.render()

    @safe
    def render(self):
        teams = self.tracker.teams
        damage = self.damage.damage
        if teams is None or damage is None or not teams.vehicles:
            return

        enemies_max = teams.totals(False)['max']
        enemies_hp = teams.health(False)['hp']
        state = values(damage, enemies_max, enemies_hp, self.hit_ally)

        translate = self.app.translate
        text = format_panel(state, self.settings, translate)
        self.show(text, panel_widget(state, self.settings, translate))
