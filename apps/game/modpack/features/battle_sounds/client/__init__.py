from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.battle import BattleHooks, arena, controls_own_vehicle, player, vehicle_state
from ....core.client.component import FeatureComponent
from ....core.client.sound import play_sound
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import KillFeed, SoundPicker, device_change, device_event
from ..settings import SCHEMA, SWITCH

try:
    from gui.battle_control.battle_constants import VEHICLE_VIEW_STATE
except ImportError:
    VEHICLE_VIEW_STATE = None


class BattleSounds(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.fire_state = getattr(VEHICLE_VIEW_STATE, 'FIRE', None)
        self.devices_state = getattr(VEHICLE_VIEW_STATE, 'DEVICES', None)
        self.hooks = BattleHooks()
        self.picker = None
        self.feed = None
        self.burning = False
        app.bus.on('battle_ready', self._on_battle_ready)
        app.bus.on('battle_leave', self._on_battle_leave)

    def _on_battle_ready(self, battle_player):
        self._on_battle_leave()
        if not self.enabled():
            return
        self.picker = SoundPicker(self.settings)
        self.feed = KillFeed(getattr(battle_player, 'playerVehicleID', None))
        self.hooks.add(vehicle_state, 'onVehicleStateUpdated', self._on_vehicle_state)
        self.hooks.add(arena, 'onVehicleKilled', self._on_vehicle_killed)

    def _on_battle_leave(self):
        self.hooks.clear()
        self.picker = None
        self.feed = None
        self.burning = False

    def play(self, key):
        if self.picker is not None:
            play_sound(self.picker.pick(key, time.time()))

    def _on_vehicle_state(self, state, value):
        if self.picker is None or state not in (self.fire_state, self.devices_state) or not controls_own_vehicle():
            return
        if state == self.fire_state:
            burning = bool(value)
            if burning and not self.burning:
                self.play('fire')
            self.burning = burning
            return
        key = device_event(*device_change(value))
        if key is not None:
            self.play(key)

    def _on_vehicle_killed(self, victim_id, killer_id, *rest):
        if self.feed is None:
            return
        if self.feed.own_vehicle_id is None:
            self.feed.own_vehicle_id = getattr(player(), 'playerVehicleID', None)
        for key in self.feed.killed(victim_id, killer_id):
            self.play(key)
