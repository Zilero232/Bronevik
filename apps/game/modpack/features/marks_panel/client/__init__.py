from __future__ import absolute_import, division, print_function, unicode_literals

import time

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import BattleHooks, controls_own_vehicle, feedback, is_enemy
from ....core.client.game import player_tank_id, values_by_name
from ....core.codec import parse_json_body
from ....core.log import safe
from ....core.net.signing import DEVICE_HEADER
from ..i18n import STRINGS
from ..model import BattleTotals, ThresholdCurve, format_moe_panel, project, rating_to_percent
from ..settings import SWITCH
from .constants import BATTLE_PANEL, KIND_BY_EVENT, LAYOUT, MOE_PATH, THRESHOLD_ERROR_TTL_S, THRESHOLD_TTL_S


class BattleMoeTracker(object):

    def __init__(self, on_update):
        self.on_update = on_update
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.totals = None
        self.hooks = BattleHooks()
        self.active = False

    def start(self):
        self.stop()
        self.totals = BattleTotals()
        self.active = True
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.on_update(self.totals)

    def stop(self):
        self.active = False
        self.hooks.clear()

    def _on_feedback(self, events):
        if not self.active or self.totals is None or not controls_own_vehicle():
            return
        changed = False
        for event in events:
            kind = self.kinds.get(event.getBattleEventType())
            if kind is None:
                continue
            extra = event.getExtra()
            if extra is None:
                continue
            if kind == 'damage' and not is_enemy(event.getTargetID()):
                continue
            if self.totals.add(kind, extra.getDamage()):
                changed = True
        if changed:
            self.on_update(self.totals)


class MarksPanel(object):

    def __init__(self, app):
        self.app = app
        app.translate.catalog.add(STRINGS)
        self.thresholds = {}
        self.threshold_requests = set()
        self.snapshot = None
        self.curve = None
        self.tracker = BattleMoeTracker(self._on_totals)
        app.bus.on('vehicle_moe', self._on_vehicle_moe)
        app.bus.on('battle_ready', self._on_battle_ready)
        app.bus.on('battle_leave', self._on_battle_leave)

    def _on_vehicle_moe(self, snapshot):
        self._ensure_thresholds(snapshot['tank_id'])

    def _ensure_thresholds(self, tank_id):
        app = self.app
        cached = self.thresholds.get(tank_id)
        now = time.time()
        if cached is not None:
            ttl = THRESHOLD_TTL_S if cached[1] is not None else THRESHOLD_ERROR_TTL_S
            if now - cached[0] < ttl:
                return
        if tank_id in self.threshold_requests:
            return
        self.threshold_requests.add(tank_id)
        headers = {'Accept': 'application/json', 'User-Agent': app.user_agent()}
        creds = app.current_credentials()
        if creds is not None:
            headers[DEVICE_HEADER] = creds.device_id

        @safe
        def done(status, body, response_headers):
            self.threshold_requests.discard(tank_id)
            curve = ThresholdCurve.from_api(parse_json_body(body)) if status == 200 else None
            self.thresholds[tank_id] = (time.time(), curve)

        app.transport.request('GET', app.config.endpoint(MOE_PATH % tank_id), headers, None, done)

    def _on_battle_ready(self, player):
        if not self.app.config.is_enabled(SWITCH):
            return
        tank_id = player_tank_id(player)
        snapshot = self.app.marks.hangar_moe.get(tank_id)
        if snapshot is None:
            return
        cached = self.thresholds.get(tank_id)
        self.snapshot = snapshot
        self.curve = cached[1] if cached is not None else None
        self.tracker.start()

    @safe
    def _on_totals(self, totals):
        snapshot = self.snapshot
        if snapshot is None:
            return
        projection = project(snapshot['moving_avg_damage'], rating_to_percent(snapshot['damage_rating']), totals, self.curve)
        self.app.ui.show(BATTLE_PANEL, format_moe_panel(projection, self.app.translate), LAYOUT)

    def _on_battle_leave(self):
        self.tracker.stop()
        self.snapshot = None
        self.curve = None
        self.app.ui.hide(BATTLE_PANEL)
