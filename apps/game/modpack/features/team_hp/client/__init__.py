from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle.teams import TeamTracker
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import format_panel
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH


class TeamHpPanel(BattlePanel):

    def __init__(self, app):
        self.tracker = TeamTracker(self.render)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)

    def start(self, player):
        self.tracker.start(self.hooks, player)

    def stop(self):
        self.tracker.stop()

    @safe
    def render(self):
        teams = self.tracker.teams
        if teams is not None and teams.vehicles:
            self.show(format_panel(teams, self.settings, self.app.translate))
