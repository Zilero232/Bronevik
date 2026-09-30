from __future__ import absolute_import, division, print_function, unicode_literals

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import BattleHooks, call, controls_own_vehicle, feedback, is_enemy, player
from .. import ShotLog, build_shot, nominal_for, normalize_shell


def own_shell_options():
    descriptor = getattr(player(), 'vehicleTypeDescriptor', None)
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
        self.hooks = BattleHooks()
        self.active = False
        self.last_by_target = {}

    def start(self):
        self.stop()
        self.log = ShotLog()
        self.options = own_shell_options()
        self.last_by_target = {}
        self.active = True
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)

    def stop(self):
        self.active = False
        self.hooks.clear()

    def take(self):
        self.stop()
        return self.log.take()

    def _on_feedback(self, events):
        if not self.active or not controls_own_vehicle():
            return
        for event in events:
            kind = event.getBattleEventType()
            if kind == BATTLE_EVENT_TYPE.KILL:
                self.log.mark_fatal(self.last_by_target.get(event.getTargetID()))
            elif kind == BATTLE_EVENT_TYPE.DAMAGE:
                self._on_damage(event)

    def _on_damage(self, event):
        target_id = event.getTargetID()
        extra = event.getExtra()
        if extra is None or not call(extra, 'isShot', False) or not is_enemy(target_id):
            return

        shell = normalize_shell(call(extra, 'getShellType'))
        nominal = nominal_for(self.options, shell, call(extra, 'isShellGold'))
        if self.log.add(build_shot(call(extra, 'getDamage', 0), nominal, shell)):
            self.last_by_target[target_id] = len(self.log.shots) - 1
