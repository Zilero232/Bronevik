from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.battle import arena, server_time
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.client.timer import Ticker
from ....core.log import safe
from ..i18n import STRINGS
from ..model import clock_values, format_battle_clock, timer_seconds
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import PERIOD_NAMES, TICK_S

try:
    from constants import ARENA_PERIOD
except ImportError:
    ARENA_PERIOD = None


class BattleClockPanel(BattlePanel):

    start_event = 'battle_enter'

    def __init__(self, app):
        self.periods = values_by_name(ARENA_PERIOD, PERIOD_NAMES)
        self.ticker = Ticker(TICK_S, self.render)
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE)

    def start(self):
        self.render()
        self.ticker.start()

    def stop(self):
        self.ticker.stop()

    def preview_text(self):
        return preview_text(self.settings, self.app.translate, time.localtime())

    @safe
    def render(self):
        current = arena()
        period = self.periods.get(getattr(current, 'period', None))
        seconds = timer_seconds(period, getattr(current, 'periodEndTime', None), server_time())
        values = clock_values(time.localtime(), self.settings, period, seconds)
        self.show(format_battle_clock(values, self.settings, self.app.translate))
