from __future__ import absolute_import

import BigWorld
from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ..shots import ShotLog, build_shot, nominal_for, normalize_shell
from .log import safe

ATTACH_RETRY_S = 1.0
ATTACH_ATTEMPTS = 15


def _session_provider():
    return getattr(BigWorld.player(), 'guiSessionProvider', None)


def _call(target, name, default=None):
    method = getattr(target, name, None)
    if method is None:
        return default
    try:
        return method()
    except Exception:
        return default


def own_shell_options():
    descriptor = getattr(BigWorld.player(), 'vehicleTypeDescriptor', None)
    gun = getattr(descriptor, 'gun', None)
    options = []
    for shot in getattr(gun, 'shots', None) or ():
        shell = getattr(shot, 'shell', None)
        damage = getattr(shell, 'damage', None)
        armor_damage = damage[0] if isinstance(damage, (list, tuple)) and damage else None
        kind = getattr(shell, 'kind', None)
        is_gold = bool(getattr(shell, 'isGold', False))
        if kind is not None and armor_damage is not None:
            options.append((kind, armor_damage, is_gold))
    return options


class ShotTracker(object):

    def __init__(self):
        self.log = ShotLog()
        self.options = []
        self.feedback = None
        self.active = False
        self.attempts = 0
        self.last_by_target = {}

    def start(self):
        self.stop()
        self.log = ShotLog()
        self.options = own_shell_options()
        self.last_by_target = {}
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

    def stop(self):
        self.active = False
        if self.feedback is not None:
            try:
                self.feedback.onPlayerFeedbackReceived -= self._on_feedback
            except Exception:
                pass
        self.feedback = None

    def take(self):
        self.stop()
        return self.log.take()

    @safe
    def _on_feedback(self, events):
        if not self.active:
            return
        player = BigWorld.player()
        provider = _session_provider()
        if provider is None or provider.shared.vehicleState.getControllingVehicleID() != player.playerVehicleID:
            return
        for event in events:
            kind = event.getBattleEventType()
            target_id = event.getTargetID()
            if kind == BATTLE_EVENT_TYPE.KILL:
                self.log.mark_fatal(self.last_by_target.get(target_id))
                continue
            if kind != BATTLE_EVENT_TYPE.DAMAGE:
                continue
            extra = event.getExtra()
            if extra is None or not _call(extra, 'isShot', False):
                continue
            arena_dp = provider.getArenaDP()
            info = arena_dp.getVehicleInfo(target_id)
            if info is None or not arena_dp.isEnemyTeam(info.team):
                continue
            shell = normalize_shell(_call(extra, 'getShellType'))
            nominal = nominal_for(self.options, shell, _call(extra, 'isShellGold'))
            if self.log.add(build_shot(_call(extra, 'getDamage', 0), nominal, shell)):
                self.last_by_target[target_id] = len(self.log.shots) - 1
