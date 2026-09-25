from __future__ import absolute_import

import BigWorld
from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ..moe import BattleTotals
from .log import safe

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
