from __future__ import absolute_import, division, print_function, unicode_literals

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import call, feedback, is_enemy
from ....core.client.game import player_tank_id, values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.client.moe import moe_service
from ....core.log import safe
from ..i18n import STRINGS
from ..model import BattleTotals, format_panel, panel_state
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import marks_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import KIND_BY_EVENT


class MarksPanel(BattlePanel):
    """The in-battle marks panel. `onPlayerFeedbackReceived` carries only the player's own events: Avatar.onBattleEvents
    and battleEventsSummary reach the feedback only while the camera follows the own vehicle (RU 1.45 Avatar.py:1623-1642),
    as in the vanilla damage log; the summary raises the totals."""

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.moe = moe_service(app)
        self.totals = None
        self.snapshot = None
        self.tank_id = None
        self.curve = None
        self.pace = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE)
        app.bus.on('component_settings', self._on_settings)
        self.moe.listen(self._on_curve)

    def start(self, player):
        tank_id = player_tank_id(player)
        snapshot = self.moe.snapshot(tank_id)
        if snapshot is None:
            return
        self.snapshot = snapshot
        self.tank_id = tank_id
        self.curve = self.moe.curve(tank_id)
        self.moe.ensure(tank_id)
        self.pace = self.moe.pace(tank_id)
        self.totals = BattleTotals()
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(feedback, 'onPlayerSummaryFeedbackReceived', self._on_summary)
        self.render()

    def stop(self):
        self.totals = None
        self.snapshot = None

    def preview_text(self):
        return preview_text(self.settings, self.app.translate)

    def preview_widget(self):
        return preview_widget(self.settings, self.app.translate)

    def _on_settings(self, component_id, changed):
        if component_id == PANEL_ID:
            self.render()

    def _on_curve(self, tank_id):
        if self.totals is not None and tank_id == self.tank_id:
            self.curve = self.moe.curve(tank_id)
            self.render()

    def _on_feedback(self, events):
        if self.totals is None:
            return
        changed = False
        for event in events:
            kind = self.kinds.get(event.getBattleEventType())
            extra = event.getExtra() if kind is not None else None
            if extra is None or (kind == 'damage' and not is_enemy(event.getTargetID())):
                continue
            changed = self.totals.add(kind, extra.getDamage()) or changed
        if changed:
            self.render()

    def _on_summary(self, event):
        if self.totals is not None and self.totals.apply_summary(call(event, 'getTotalDamage'), call(event, 'getTotalStunDamage')):
            self.render()

    @safe
    def render(self):
        if self.totals is None or self.snapshot is None:
            return
        state = panel_state(self.snapshot, self.totals.combined(), self.curve, self.pace, self.settings)
        self.show(format_panel(state, self.settings, self.app.translate), marks_widget(state, self.settings, self.app.translate))
