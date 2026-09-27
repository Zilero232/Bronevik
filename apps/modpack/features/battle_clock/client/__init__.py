from __future__ import absolute_import, division, print_function, unicode_literals

import time

import BigWorld

from ....core.client.battle import arena, server_time
from ....core.client.hud import hud_layer
from ....core.log import safe
from ..i18n import STRINGS
from ..model import clock_values, format_battle_clock, timer_seconds
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import PERIOD_NAMES, TICK_S

try:
    from constants import ARENA_PERIOD
except ImportError:
    ARENA_PERIOD = None


def period_names():
    names = {}
    for attr, name in PERIOD_NAMES:
        value = getattr(ARENA_PERIOD, attr, None)
        if value is not None:
            names[value] = name
    return names


class BattleClockPanel(object):

    def __init__(self, app):
        self.app = app
        app.translate.catalog.add(STRINGS)
        self.hud = hud_layer(app)
        self.settings = self.hud.register(PANEL_ID, SCHEMA)
        self.periods = period_names()
        self.running = False
        app.bus.on('battle_enter', self._on_battle_enter)
        app.bus.on('battle_leave', self._on_battle_leave)

    def _on_battle_enter(self):
        if self.app.config.is_enabled(SWITCH) and not self.running:
            self.running = True
            self._tick()

    def _on_battle_leave(self):
        self.running = False
        self.hud.hide(PANEL_ID)

    def _tick(self):
        if not self.running:
            return
        self.render()
        BigWorld.callback(TICK_S, self._tick)

    @safe
    def render(self):
        current = arena()
        period = self.periods.get(getattr(current, 'period', None))
        seconds = timer_seconds(period, getattr(current, 'periodEndTime', None), server_time())
        values = clock_values(time.localtime(), self.settings, period, seconds)
        self.hud.show(PANEL_ID, format_battle_clock(values, self.settings, self.app.translate))
