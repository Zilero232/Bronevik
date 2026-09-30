from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.battle import arena, server_time
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.client.timer import Ticker
from ....core.hud.stock import BATTLE_TIMER
from ....core.log import safe
from ..i18n import STRINGS
from ..model import clock_values, format_battle_clock, timer_seconds
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import clock_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import PERIOD_NAMES, TICK_S

try:
    from constants import ARENA_PERIOD
except ImportError:
    ARENA_PERIOD = None


PANEL_SPEC = PanelSpec(
    panel_id=PANEL_ID,
    schema=SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
)


class BattleClockPanel(BattlePanel):

    start_event = 'battle_enter'

    def __init__(self, app):
        self.periods = values_by_name(ARENA_PERIOD, PERIOD_NAMES)
        self.ticker = Ticker(TICK_S, self.render)
        BattlePanel.__init__(self, app, PANEL_SPEC)

    def start(self):
        self.render()
        self.ticker.start()

    def stop(self):
        self.ticker.stop()

    def preview_text(self):
        return preview_text(self.settings, self.app.translate, time.localtime())

    def preview_widget(self):
        return preview_widget(self.settings, time.localtime())

    def stock_aliases(self):
        if self.settings.get('replace_timer') and self.settings.get('show_timer'):
            return (BATTLE_TIMER,)
        return ()

    @safe
    def render(self):
        current = arena()
        period = self.periods.get(getattr(current, 'period', None))
        period_end = getattr(current, 'periodEndTime', None)
        seconds = timer_seconds(period, period_end, server_time())

        values = clock_values(time.localtime(), self.settings, period, seconds)
        text = format_battle_clock(values, self.settings, self.app.translate)
        self.show(text, clock_widget(values, self.settings))
