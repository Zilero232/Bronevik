from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle.damage import DamageTracker
from ....core.client.battle.teams import TeamTracker
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import format_panel, values
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import panel_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH


class MainGunPanel(BattlePanel):
    """Own damage against the High Caliber threshold, with the enemy HP the team HP panel reads."""

    def __init__(self, app):
        self.tracker = TeamTracker(self.render)
        self.damage = DamageTracker(self.render)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)

    def start(self, player):
        self.damage.start(self.hooks)
        self.tracker.start(self.hooks, player)

    def stop(self):
        self.tracker.stop()
        self.damage.stop()

    @safe
    def render(self):
        teams = self.tracker.teams
        damage = self.damage.damage
        if teams is None or damage is None or not teams.vehicles:
            return
        enemies = teams.totals(False)
        state = values(damage, enemies['max'], enemies['hp'])
        self.show(format_panel(state, self.settings, self.app.translate), panel_widget(state, self.settings, self.app.translate))
