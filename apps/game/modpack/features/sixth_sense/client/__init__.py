from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.battle import arena, call, controls_own_vehicle, player, vehicle_state
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.client.native import apply_changed
from ....core.client.sound import play_mp3, play_sound
from ....core.client.timer import Ticker
from ....core.hud.stock import SIXTH_SENSE
from ....core.log import safe
from ..i18n import STRINGS
from ..model import SixthSense, format_sixth_sense, lamp_duration, to_native
from ..model.constants import ENDING_PERIODS, OBSERVED, OWN_SPOTTING_ATTR, PREVIEW_SIZE, TICK_SOUND, VEHICLE_STATES
from ..model.preview import preview_text, preview_widget
from ..model.widget import sixth_sense_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import TICK_S

try:
    from constants import ARENA_PERIOD
    from gui.battle_control.battle_constants import VEHICLE_VIEW_STATE
    from PlayerEvents import g_playerEvents
except ImportError:
    ARENA_PERIOD = VEHICLE_VIEW_STATE = g_playerEvents = None


# RU 1.45 client source: PlayerAvatar.getVehicleDescriptor() is the own vehicle's descriptor, whose miscAttrs the client
# fills with the installed devices at their slot's level (VehicleDescriptor._updateAttributes).
def own_spotting_decrease():
    descriptor = call(player(), 'getVehicleDescriptor')
    attributes = getattr(descriptor, 'miscAttrs', None) or {}
    return attributes.get(OWN_SPOTTING_ATTR, 0.0)


class SixthSenseAlert(BattlePanel):

    def __init__(self, app):
        self.states = values_by_name(VEHICLE_VIEW_STATE, VEHICLE_STATES)
        self.ending_periods = values_by_name(ARENA_PERIOD, [(name, True) for name in ENDING_PERIODS])
        self.lamp = None
        self.ticker = Ticker(TICK_S, self._tick)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)

    def settings_changed(self, changed):
        if 'lamp_sound' in (changed or ()) and self.enabled_in_hangar():
            apply_changed(to_native(self.settings.to_dict()))

    def start(self, player):
        if not self.states:
            return
        self.lamp = SixthSense()
        self.hooks.add(vehicle_state, 'onVehicleStateUpdated', self._on_vehicle_state)
        self.hooks.add(arena, 'onPeriodChange', self._on_period)
        self.hooks.add(lambda: g_playerEvents, 'onRoundFinished', self._finish)

    def stop(self):
        self.lamp = None
        self.ticker.stop()

    def stock_aliases(self):
        return (SIXTH_SENSE,) if self.settings.get('replace_stock') else ()

    def _on_vehicle_state(self, state, value):
        name = self.states.get(state)
        if self.lamp is None or name is None:
            return
        if name == OBSERVED and not controls_own_vehicle():
            return

        duration = lamp_duration(self.settings.get('hide_after_s'), own_spotting_decrease())
        change = self.lamp.vehicle_state(name, value, time.time(), duration)

        if change == 'show':
            self._light()
        elif change == 'hide':
            self.hide()

    def _light(self):
        play_sound(self.settings.get('sound_event'))
        self.render()
        self.ticker.start()

    def _on_period(self, period, *_):
        if period in self.ending_periods:
            self._finish()

    def _finish(self, *_):
        if self.lamp is not None:
            self.lamp.finish()
        self.hide()

    def _tick(self):
        lamp = self.lamp
        if lamp is None or not lamp.lit:
            return False

        now = time.time()
        if lamp.expired(now, self.settings.get('hide_after_s')):
            self.hide()
            return False
        is_tick_due = lamp.tick_due(now)
        if is_tick_due and self.settings.get('tick_sound'):
            play_mp3(TICK_SOUND)

        self.render()
        return True

    @safe
    def render(self):
        if self.lamp is not None and self.lamp.lit:
            now = time.time()
            self.show(format_sixth_sense(self.lamp, self.settings, self.app.translate, now),
                      sixth_sense_widget(self.lamp, self.settings, self.app.translate, now))
