from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle.teams import TeamTracker
from ....core.client.hud.panel import BattlePanel
from ....core.hud.stock import FRAG_CORRELATION_BAR
from ....core.log import safe
from ..i18n import STRINGS
from ..model import format_panel
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import team_hp_widget
from ..settings import OVERLAY_STYLES, PANEL_ID, SCHEMA, SWITCH


class TeamHpPanel(BattlePanel):
    """Replaces the stock score strip (fragCorrelationBar) while the Gameface page draws it, except in an overlay style."""

    def __init__(self, app):
        self.tracker = TeamTracker(self.render)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)

    def start(self, player):
        self.tracker.start(self.hooks, player)

    def stop(self):
        self.tracker.stop()

    def stock_aliases(self):
        replaces = self.settings.get('replace_stock') and self.settings.get('style') not in OVERLAY_STYLES
        return (FRAG_CORRELATION_BAR,) if replaces else ()

    @safe
    def render(self):
        teams = self.tracker.teams
        if teams is not None and teams.vehicles:
            self.show(format_panel(teams, self.settings, self.app.translate), team_hp_widget(teams, self.settings))
