"""In-battle MoE panel: thresholds for the hangar vehicle, own damage/assist during the battle, the
projected percentage and the damage still needed for the next mark (switch `battle_moe_panel`)."""
from __future__ import absolute_import

import time

import BigWorld
from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ...companion.client.game import player_tank_id
from ...companion.sender import parse_json_body
from ...core.log import safe
from ...core.signing import DEVICE_HEADER
from .i18n import STRINGS
from .model import BattleTotals, ThresholdCurve, format_moe_panel, project, rating_to_percent

BATTLE_PANEL = 'otmetki.moe'
LAYOUT = {'x': 0, 'y': 120, 'alignX': 'center', 'alignY': 'top'}
MOE_PATH = '/v1/moe/%d'
THRESHOLD_TTL_S = 6 * 3600
THRESHOLD_ERROR_TTL_S = 10 * 60

KIND_BY_EVENT = {
    BATTLE_EVENT_TYPE.DAMAGE: 'damage',
    BATTLE_EVENT_TYPE.RADIO_ASSIST: 'radio',
    BATTLE_EVENT_TYPE.TRACK_ASSIST: 'track',
    BATTLE_EVENT_TYPE.STUN_ASSIST: 'stun',
}

ATTACH_RETRY_S = 1.0
ATTACH_ATTEMPTS = 15


def _session_provider():
    player = BigWorld.player()
    return getattr(player, 'guiSessionProvider', None)


class BattleMoeTracker(object):

    def __init__(self, on_update):
        self.on_update = on_update
        self.totals = None
        self.feedback = None
        self.active = False
        self.attempts = 0

    def start(self):
        self.stop()
        self.totals = BattleTotals()
        self.active = True
        self.attempts = 0
        self._attach()

    @safe
    def _attach(self):
        if not self.active:
            return
        provider = _session_provider()
        feedback = getattr(getattr(provider, 'shared', None), 'feedback', None)
        if feedback is None:
            self.attempts += 1
            if self.attempts < ATTACH_ATTEMPTS:
                BigWorld.callback(ATTACH_RETRY_S, self._attach)
            return
        feedback.onPlayerFeedbackReceived += self._on_feedback
        self.feedback = feedback
        self.on_update(self.totals)

    def stop(self):
        self.active = False
        if self.feedback is not None:
            try:
                self.feedback.onPlayerFeedbackReceived -= self._on_feedback
            except Exception:
                pass
        self.feedback = None

    @staticmethod
    def _is_enemy(provider, target_id):
        arena_dp = provider.getArenaDP()
        info = arena_dp.getVehicleInfo(target_id)
        return info is not None and arena_dp.isEnemyTeam(info.team)

    @safe
    def _on_feedback(self, events):
        if not self.active or self.totals is None:
            return
        player = BigWorld.player()
        provider = _session_provider()
        if provider is None:
            return
        if provider.shared.vehicleState.getControllingVehicleID() != player.playerVehicleID:
            return
        changed = False
        for event in events:
            kind = KIND_BY_EVENT.get(event.getBattleEventType())
            if kind is None:
                continue
            extra = event.getExtra()
            if extra is None:
                continue
            if kind == 'damage' and not self._is_enemy(provider, event.getTargetID()):
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
        if not self.app.config.is_enabled('battle_moe_panel'):
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
