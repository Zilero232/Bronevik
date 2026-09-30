from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.battle_tally import MARKER_OUTCOMES
from ....core.client.battle import call, controls_own_vehicle, feedback, is_enemy, player, vehicle_class, vehicle_info, vehicle_name
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ....core.shells import shell_code
from ..i18n import STRINGS
from ..model import HitLog, format_hit_log, own_shot_health
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import hit_log_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH

try:
    from gui.battle_control.battle_constants import FEEDBACK_EVENT_ID
except ImportError:
    FEEDBACK_EVENT_ID = None


class HitLogPanel(BattlePanel):

    def __init__(self, app):
        self.outcomes = values_by_name(FEEDBACK_EVENT_ID, MARKER_OUTCOMES)
        self.health_event = getattr(FEEDBACK_EVENT_ID, 'VEHICLE_HEALTH', None)
        self.log = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)

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
            self._describe(vehicle_id)
            self.render()

    # The class and max HP the enemy's marker and the player panels already show.
    def _describe(self, vehicle_id):
        if vehicle_id not in self.log.targets:
            vehicle_type = getattr(vehicle_info(vehicle_id), 'vehicleType', None)
            self.log.describe(vehicle_id, vehicle_class(vehicle_id), getattr(vehicle_type, 'maxHealth', None))

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
                self._describe(target_id)
            elif kind == getattr(BATTLE_EVENT_TYPE, 'CRIT', None) and call(extra, 'isShot', False):
                changed = self.log.add_crits(target_id, call(extra, 'getCritsCount', 0), now) or changed
        if changed:
            self.render()

    def extended_changed(self, held):
        if self.settings.get('alt_mode'):
            self.render()

    @safe
    def render(self):
        if self.log is not None:
            translate = self.app.translate
            extended = self.extended()

            text = format_hit_log(self.log, self.settings, translate, extended)
            payload = hit_log_widget(self.log, self.settings, translate, extended)
            self.show(text, payload)
