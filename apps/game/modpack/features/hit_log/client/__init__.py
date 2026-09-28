from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import call, controls_own_vehicle, feedback, is_enemy, player, vehicle_name
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import HitLog, format_hit_log, own_shot_health
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import OUTCOME_BY_FEEDBACK

try:
    from gui.battle_control.battle_constants import FEEDBACK_EVENT_ID
except ImportError:
    FEEDBACK_EVENT_ID = None


class HitLogPanel(BattlePanel):

    def __init__(self, app):
        self.outcomes = values_by_name(FEEDBACK_EVENT_ID, OUTCOME_BY_FEEDBACK)
        self.health_event = getattr(FEEDBACK_EVENT_ID, 'VEHICLE_HEALTH', None)
        self.log = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)

    def start(self, player):
        self.log = HitLog()
        self.hooks.add(feedback, 'onVehicleFeedbackReceived', self._on_vehicle_feedback)
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_player_feedback)
        self.render()

    def stop(self):
        self.log = None

    def _on_vehicle_feedback(self, event_id, vehicle_id, value):
        if self.log is None or not controls_own_vehicle():
            return
        now = time.time()
        if event_id == self.health_event:
            health = own_shot_health(value, getattr(player(), 'playerVehicleID', None))
            if self.log.set_health(vehicle_id, health, now):
                self.render()
            return
        outcome = self.outcomes.get(event_id)
        if outcome is not None and is_enemy(vehicle_id) and self.log.add_result(vehicle_id, outcome, now, vehicle_name(vehicle_id)):
            self.render()

    def _on_player_feedback(self, events):
        if self.log is None or not controls_own_vehicle():
            return
        now = time.time()
        changed = False
        for event in events:
            kind = event.getBattleEventType()
            extra = event.getExtra()
            target_id = event.getTargetID()
            if extra is None or not is_enemy(target_id):
                continue
            if kind == BATTLE_EVENT_TYPE.DAMAGE and call(extra, 'isShot', False):
                shell = shell_code(call(extra, 'getShellType'))
                changed = self.log.add_damage(target_id, call(extra, 'getDamage', 0), now, vehicle_name(target_id), shell) or changed
            elif kind == getattr(BATTLE_EVENT_TYPE, 'CRIT', None) and call(extra, 'isShot', False):
                changed = self.log.add_crits(target_id, call(extra, 'getCritsCount', 0), now) or changed
        if changed:
            self.render()

    @safe
    def render(self):
        if self.log is not None:
            self.show(format_hit_log(self.log, self.settings, self.app.translate))
