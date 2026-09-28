from __future__ import absolute_import, division, print_function, unicode_literals

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import call, feedback, is_enemy
from ....core.client.battle.teams import TeamTracker
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import format_panel, values
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH


class MainGunPanel(BattlePanel):
    """Own damage against the High Caliber threshold, with the enemy HP the team HP panel reads."""

    def __init__(self, app):
        self.tracker = TeamTracker(self.render)
        self.damage = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)

    def start(self, player):
        self.damage = 0
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(feedback, 'onPlayerSummaryFeedbackReceived', self._on_summary)
        self.tracker.start(self.hooks, player)

    def stop(self):
        self.tracker.stop()
        self.damage = None

    # onPlayerFeedbackReceived carries only the player's own events; damage to allies is not counted.
    def _on_feedback(self, events):
        if self.damage is None:
            return
        added = 0
        for event in events:
            if event.getBattleEventType() == getattr(BATTLE_EVENT_TYPE, 'DAMAGE', None) and is_enemy(event.getTargetID()):
                added += call(event.getExtra(), 'getDamage', 0) or 0
        if added:
            self.damage += added
            self.render()

    def _on_summary(self, event):
        total = call(event, 'getTotalDamage')
        if self.damage is not None and total and total > self.damage:
            self.damage = total
            self.render()

    @safe
    def render(self):
        teams = self.tracker.teams
        if teams is None or self.damage is None or not teams.vehicles:
            return
        enemies = teams.totals(False)
        self.show(format_panel(values(self.damage, enemies['max'], enemies['hp']), self.settings, self.app.translate))
