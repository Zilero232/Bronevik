from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.battle import controls_own_vehicle, vehicle_state
from ....core.client.hud.panel import BattlePanel
from ....core.client.native import apply_changed
from ....core.client.sound import play_sound
from ....core.client.timer import Ticker
from ....core.hud.stock import SIXTH_SENSE
from ....core.log import safe
from ..i18n import STRINGS
from ..model import SixthSense, format_sixth_sense, to_native
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import sixth_sense_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import TICK_S

try:
    from gui.battle_control.battle_constants import VEHICLE_VIEW_STATE
except ImportError:
    VEHICLE_VIEW_STATE = None


class SixthSenseAlert(BattlePanel):

    def __init__(self, app):
        self.observed_state = getattr(VEHICLE_VIEW_STATE, 'OBSERVED_BY_ENEMY', None)
        self.switching_state = getattr(VEHICLE_VIEW_STATE, 'SWITCHING', None)
        self.lamp = None
        self.ticker = Ticker(TICK_S, self._tick)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)

    def settings_changed(self, changed):
        if 'lamp_sound' in (changed or ()) and self.enabled_in_hangar():
            apply_changed(to_native(self.settings.to_dict()))

    def start(self, player):
        if self.observed_state is None:
            return
        self.lamp = SixthSense()
        self.hooks.add(vehicle_state, 'onVehicleStateUpdated', self._on_vehicle_state)

    def stop(self):
        self.lamp = None
        self.ticker.stop()

    def stock_aliases(self):
        return (SIXTH_SENSE,) if self.settings.get('replace_stock') else ()

    def _on_vehicle_state(self, state, value):
        lamp = self.lamp
        if lamp is None:
            return
        if state == self.switching_state:
            lamp.reset()
            self.hide()
            return
        if state != self.observed_state or not controls_own_vehicle():
            return
        change = lamp.observed(bool(value), time.time())
        if change == 'show':
            play_sound(self.settings.get('sound_event'))
            self.render()
            self.ticker.start()
        elif change == 'hide':
            self.hide()

    def _tick(self):
        lamp = self.lamp
        if lamp is None or not lamp.lit:
            return False
        if lamp.expired(time.time(), self.settings.get('hide_after_s')):
            self.hide()
            return False
        self.render()
        return True

    @safe
    def render(self):
        if self.lamp is not None and self.lamp.lit:
            now = time.time()
            self.show(format_sixth_sense(self.lamp, self.settings, self.app.translate, now),
                      sixth_sense_widget(self.lamp, self.settings, self.app.translate, now))
