from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import BattleHooks, call, controls_own_vehicle, feedback, is_enemy, vehicle_name
from ....core.client.hud import hud_layer
from ....core.log import safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import HitLog, format_hit_log
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import OUTCOME_BY_FEEDBACK

try:
    from gui.battle_control.battle_constants import FEEDBACK_EVENT_ID
except ImportError:
    FEEDBACK_EVENT_ID = None


def outcome_by_feedback():
    outcomes = {}
    for name, outcome in OUTCOME_BY_FEEDBACK:
        value = getattr(FEEDBACK_EVENT_ID, name, None)
        if value is not None:
            outcomes[value] = outcome
    return outcomes


class HitLogPanel(object):

    def __init__(self, app):
        self.app = app
        app.translate.catalog.add(STRINGS)
        self.hud = hud_layer(app)
        self.settings = self.hud.register(PANEL_ID, SCHEMA)
        self.outcomes = outcome_by_feedback()
        self.health_event = getattr(FEEDBACK_EVENT_ID, 'VEHICLE_HEALTH', None)
        self.hooks = BattleHooks()
        self.log = None
        app.bus.on('battle_ready', self._on_battle_ready)
        app.bus.on('battle_leave', self._on_battle_leave)

    def _on_battle_ready(self, player):
        self._on_battle_leave()
        if not self.app.config.is_enabled(SWITCH):
            return
        self.log = HitLog()
        self.hooks.add(feedback, 'onVehicleFeedbackReceived', self._on_vehicle_feedback)
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_player_feedback)
        self.render()

    def _on_battle_leave(self):
        self.hooks.clear()
        self.log = None
        self.hud.hide(PANEL_ID)

    @safe
    def _on_vehicle_feedback(self, event_id, vehicle_id, value):
        if self.log is None or not controls_own_vehicle():
            return
        now = time.time()
        if event_id == self.health_event:
            health = value[0] if isinstance(value, (list, tuple)) and value else None
            if self.log.set_health(vehicle_id, health, now):
                self.render()
            return
        outcome = self.outcomes.get(event_id)
        if outcome is not None and is_enemy(vehicle_id) and self.log.add_result(vehicle_id, outcome, now, vehicle_name(vehicle_id)):
            self.render()

    @safe
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
            self.hud.show(PANEL_ID, format_hit_log(self.log, self.settings, self.app.translate))
