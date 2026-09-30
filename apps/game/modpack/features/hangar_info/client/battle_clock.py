from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.battle import arena, server_time
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel, PanelSpec
from ....core.client.timer import Ticker
from ....core.hud.stock import BATTLE_TIMER
from ....core.log import safe
from ..i18n import STRINGS
from ..model.battle_clock import clock_values, format_battle_clock, timer_seconds
from ..model.battle_clock.constants import PREVIEW_SIZE
from ..model.battle_clock.preview import preview_text, preview_widget
from ..model.battle_clock.widget import clock_widget
from ..settings import CLOCK_PANEL_ID, CLOCK_SCHEMA, SWITCH
from .constants import CLOCK_TICK_S, PERIOD_NAMES

try:
    from constants import ARENA_PERIOD
except ImportError:
    ARENA_PERIOD = None


PANEL_SPEC = PanelSpec(
    panel_id=CLOCK_PANEL_ID,
    schema=CLOCK_SCHEMA,
    switch=SWITCH,
    strings=STRINGS,
    preview_size=PREVIEW_SIZE,
)


# The place stays in the `battle_clock` panel section (the id the clock had as a component of its own, so a player's
# place survives the merge); what it shows is set in hangar_info's section, `info`.
class BattleClockPanel(BattlePanel):

    start_event = 'battle_enter'

    def __init__(self, app, info):
        self.info = info
        self.periods = values_by_name(ARENA_PERIOD, PERIOD_NAMES)
        self.ticker = Ticker(CLOCK_TICK_S, self.render)
        BattlePanel.__init__(self, app, PANEL_SPEC)

    def enabled(self):
        return BattlePanel.enabled(self) and bool(self.info.get('battle_clock'))

    def start(self):
        self.render()
        self.ticker.start()

    def stop(self):
        self.ticker.stop()

    def info_changed(self):
        if self.running and not self.enabled():
            self._on_leave()
        elif self.running:
            self.sync_stock()
            self.render()

    def preview_text(self):
        return preview_text(self.info, time.localtime(), self.settings.get('font_size'))

    def preview_widget(self):
        return preview_widget(self.info, time.localtime())

    def stock_aliases(self):
        return (BATTLE_TIMER,) if self.info.get('replace_timer') else ()

    @safe
    def render(self):
        current = arena()
        period = self.periods.get(getattr(current, 'period', None))
        seconds = timer_seconds(period, getattr(current, 'periodEndTime', None), server_time())

        values = clock_values(time.localtime(), self.info, seconds)
        self.show(format_battle_clock(values, self.settings.get('font_size')), clock_widget(values))
