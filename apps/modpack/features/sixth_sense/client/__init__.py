from __future__ import absolute_import, division, print_function, unicode_literals

import time

import BigWorld

from ....core.client.battle import BattleHooks, controls_own_vehicle, vehicle_state
from ....core.client.hud import hud_layer
from ....core.log import log_exception, safe
from ..i18n import STRINGS
from ..model import SixthSense, format_sixth_sense
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import TICK_S

try:
    from gui.battle_control.battle_constants import VEHICLE_VIEW_STATE
except ImportError:
    VEHICLE_VIEW_STATE = None


def play_sound(event_name):
    if not event_name:
        return
    try:
        import SoundGroups
        SoundGroups.g_instance.playSound2D(str(event_name))
    except Exception:
        log_exception('sixth sense sound %s' % event_name)


class SixthSenseAlert(object):

    def __init__(self, app):
        self.app = app
        app.translate.catalog.add(STRINGS)
        self.hud = hud_layer(app)
        self.settings = self.hud.register(PANEL_ID, SCHEMA)
        self.observed_state = getattr(VEHICLE_VIEW_STATE, 'OBSERVED_BY_ENEMY', None)
        self.switching_state = getattr(VEHICLE_VIEW_STATE, 'SWITCHING', None)
        self.hooks = BattleHooks()
        self.lamp = None
        self.ticking = False
        app.bus.on('battle_ready', self._on_battle_ready)
        app.bus.on('battle_leave', self._on_battle_leave)

    def _on_battle_ready(self, player):
        self._on_battle_leave()
        if not self.app.config.is_enabled(SWITCH) or self.observed_state is None:
            return
        self.lamp = SixthSense()
        self.hooks.add(vehicle_state, 'onVehicleStateUpdated', self._on_vehicle_state)

    def _on_battle_leave(self):
        self.hooks.clear()
        self.lamp = None
        self.ticking = False
        self.hud.hide(PANEL_ID)

    @safe
    def _on_vehicle_state(self, state, value):
        lamp = self.lamp
        if lamp is None:
            return
        if state == self.switching_state:
            lamp.reset()
            self.hud.hide(PANEL_ID)
            return
        if state != self.observed_state or not controls_own_vehicle():
            return
        change = lamp.observed(bool(value), time.time())
        if change == 'show':
            play_sound(self.settings.get('sound_event'))
            self.render()
            if not self.ticking:
                self.ticking = True
                BigWorld.callback(TICK_S, self._tick)
        elif change == 'hide':
            self.hud.hide(PANEL_ID)

    def _tick(self):
        lamp = self.lamp
        if lamp is None or not lamp.lit:
            self.ticking = False
            return
        if lamp.expired(time.time(), self.settings.get('hide_after_s')):
            self.ticking = False
            self.hud.hide(PANEL_ID)
            return
        self.render()
        BigWorld.callback(TICK_S, self._tick)

    @safe
    def render(self):
        if self.lamp is not None and self.lamp.lit:
            self.hud.show(PANEL_ID, format_sixth_sense(self.lamp, self.settings, self.app.translate, time.time()))
