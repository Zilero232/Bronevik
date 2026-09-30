from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle.teams import TeamTracker
from ....core.client.hud.panel import BattlePanel
from ....core.hud.stock import FRAG_CORRELATION_BAR
from ....core.log import safe
from ..i18n import STRINGS
from ..model import format_panel, pinned_y, replaces_stock
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import team_hp_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH


class TeamHpPanel(BattlePanel):
    """Replaces the stock score strip (fragCorrelationBar) while the Gameface page draws it, except in an overlay style. Pinned by
    default: it stays in the stock strip's place (or right under it) and takes no drag."""

    def __init__(self, app):
        self.tracker = TeamTracker(self.render)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)

    def start(self, player):
        self.tracker.start(self.hooks, player)

    def stop(self):
        self.tracker.stop()

    def settings_changed(self, changed):
        self.render()

    def stock_aliases(self):
        return (FRAG_CORRELATION_BAR,) if replaces_stock(self.settings) else ()

    @safe
    def render(self):
        teams = self.tracker.teams
        if teams is not None and teams.vehicles:
            self.show(format_panel(teams, self.settings, self.app.translate), team_hp_widget(teams, self.settings))
            if self.settings.get('pinned'):
                self.hud.place(PANEL_ID, self.settings.get('x'), pinned_y(self.settings))
