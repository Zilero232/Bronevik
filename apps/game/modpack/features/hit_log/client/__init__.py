from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.battle_tally import MARKER_OUTCOMES
from ....core.client.battle import (
    call,
    controls_own_vehicle,
    feedback,
    is_enemy,
    player,
    vehicle_class,
    vehicle_info,
    vehicle_name,
)
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel, PanelSpec
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


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


class HitLogPanel(BattlePanel):

    def __init__(self, app):
        self.outcomes = values_by_name(FEEDBACK_EVENT_ID, MARKER_OUTCOMES)
        self.health_event = getattr(FEEDBACK_EVENT_ID, 'VEHICLE_HEALTH', None)
        self.log = None
        BattlePanel.__init__(self, app, PANEL_SPEC)

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

        if event_id == self.health_event:
            self._set_health(vehicle_id, value)
        else:
            self._add_result(event_id, vehicle_id)

    def _set_health(self, vehicle_id, value):
        health = own_shot_health(value, getattr(player(), 'playerVehicleID', None))
        if self.log.set_health(vehicle_id, health, time.time()):
            self.render()

    def _add_result(self, event_id, vehicle_id):
        outcome = self.outcomes.get(event_id)
        if outcome is None or not is_enemy(vehicle_id):
            return

        if self.log.add_result(vehicle_id, outcome, time.time(), vehicle_name(vehicle_id)):
            self._describe(vehicle_id)
            self.render()

    # The class and max HP the enemy's marker and the player panels already show.
    def _describe(self, vehicle_id):
        if vehicle_id in self.log.targets:
            return

        vehicle_type = getattr(vehicle_info(vehicle_id), 'vehicleType', None)
        self.log.describe(vehicle_id, vehicle_class(vehicle_id), getattr(vehicle_type, 'maxHealth', None))

    def _on_player_feedback(self, events):
        if self.log is None or not controls_own_vehicle():
            return

        now = time.time()
        changed = False
        for event in events:
            changed = self._add_shot(event, now) or changed

        if changed:
            self.render()

    def _add_shot(self, event, now):
        extra = event.getExtra()
        target_id = event.getTargetID()
        if extra is None or not is_enemy(target_id) or not call(extra, 'isShot', False):
            return False

        kind = event.getBattleEventType()
        if kind == BATTLE_EVENT_TYPE.DAMAGE:
            shell = shell_code(call(extra, 'getShellType'))
            added = self.log.add_damage(target_id, call(extra, 'getDamage', 0), now, vehicle_name(target_id), shell)
            self._describe(target_id)
            return added

        if kind == getattr(BATTLE_EVENT_TYPE, 'CRIT', None):
            return self.log.add_crits(target_id, call(extra, 'getCritsCount', 0), now)

        return False

    def extended_changed(self, held):
        if self.settings.get('alt_mode'):
            self.render()

    @safe
    def render(self):
        if self.log is None:
            return

        translate = self.app.translate
        extended = self.extended()

        text = format_hit_log(self.log, self.settings, translate, extended)
        payload = hit_log_widget(self.log, self.settings, translate, extended)
        self.show(text, payload)
