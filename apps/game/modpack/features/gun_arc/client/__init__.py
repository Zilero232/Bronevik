# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import controls_own_vehicle, player
from ....core.client.hud.panel import BattlePanel
from ....core.client.timer import Ticker
from ....core.log import safe
from ..i18n import STRINGS
from ..model import arc_state, format_panel
from ..model.constants import PREVIEW_SIZE, TICK_S
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH


def yaw_limits(battle_player):
    """RU 1.45 client source: VehicleDescriptor.gun.turretYawLimits, (min, max) in radians or None (gui/battle_control/vehicle_getter)."""
    return getattr(getattr(getattr(battle_player, 'vehicleTypeDescriptor', None), 'gun', None), 'turretYawLimits', None)


def turret_yaw():
    """RU 1.45 client source: VehicleGunRotator.turretYaw, the own turret's yaw relative to the hull in radians."""
    return getattr(getattr(player(), 'gunRotator', None), 'turretYaw', None)


class GunArcPanel(BattlePanel):
    """How far the own gun can still turn to each side before its traverse limits (УГН), for vehicles that have them."""

    def __init__(self, app):
        self.limits = None
        self.text = None
        self.ticker = Ticker(TICK_S, self._on_tick)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)

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
        text = format_panel(arc_state(turret_yaw(), self.limits), self.settings, self.app.translate) if controls_own_vehicle() else None
        if text == self.text:
            return
        self.text = text
        if text:
            self.show(text)
        else:
            self.hide()
