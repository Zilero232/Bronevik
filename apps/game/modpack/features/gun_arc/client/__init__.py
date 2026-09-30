# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import controls_own_vehicle, player
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.client.timer import Ticker
from ....core.log import safe
from ..i18n import STRINGS
from ..model import arc_state, format_panel
from ..model.constants import PREVIEW_SIZE, TICK_S
from ..model.preview import preview_text, preview_widget
from ..model.widget import panel_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH


# RU 1.45 client source: VehicleDescriptor.gun.turretYawLimits, (min, max) in radians or None
# (gui/battle_control/vehicle_getter).
def yaw_limits(battle_player):
    descriptor = getattr(battle_player, 'vehicleTypeDescriptor', None)
    gun = getattr(descriptor, 'gun', None)
    return getattr(gun, 'turretYawLimits', None)


# RU 1.45 client source: VehicleGunRotator.turretYaw, the own turret's yaw relative to the hull in radians.
def turret_yaw():
    rotator = getattr(player(), 'gunRotator', None)
    return getattr(rotator, 'turretYaw', None)


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
    preview_text=preview_text,
    preview_widget=preview_widget,
)


class GunArcPanel(BattlePanel):

    def __init__(self, app):
        self.limits = None
        self.text = None
        self.ticker = Ticker(TICK_S, self._on_tick)
        BattlePanel.__init__(self, app, PANEL_SPEC)

    def start(self, battle_player):
        self.limits = yaw_limits(battle_player)
        self.text = None
        if self.limits:
            self.ticker.start()

    def stop(self):
        self.ticker.stop()
        self.limits = None
        self.text = None

    def _on_tick(self):
        if not self.limits:
            return False
        self.render()
        return True

    @safe
    def render(self):
        state = None
        if controls_own_vehicle():
            state = arc_state(turret_yaw(), self.limits)
        text = format_panel(state, self.settings, self.app.translate)
        if text == self.text:
            return

        self.text = text
        if text:
            self.show(text, panel_widget(state, self.settings, self.app.translate))
        else:
            self.hide()
