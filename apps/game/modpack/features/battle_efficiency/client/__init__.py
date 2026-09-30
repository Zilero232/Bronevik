from __future__ import absolute_import, division, print_function, unicode_literals

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import call, feedback, is_enemy
from ....core.client.game import on_vehicle_changed, player_tank_id, selected_tank_id, values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.client.me import tank_ratings
from ....core.compat import is_number
from ....core.log import safe
from ..i18n import STRINGS
from ..model import BattleTotals, format_panel, panel_state
from ..model.constants import KIND_BY_EVENT, PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.widget import panel_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH


class BattleEfficiencyPanel(BattlePanel):
    """This battle's WN8 estimate and damage against the own average on the tank. The tank's row (/mod/me/tanks:
    average, WN8, expected values) is read in the hangar when the vehicle is selected and kept for the battle."""

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.tanks = tank_ratings(app)
        self.totals = None
        self.row = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)
        app.bus.on('hangar', self._on_vehicle_changed)
        on_vehicle_changed(self._on_vehicle_changed, 'battle efficiency')

    def _on_vehicle_changed(self):
        if self.enabled_in_hangar():
            self.tanks.ensure(selected_tank_id())

    def settings_changed(self, changed):
        self.render()

    def start(self, player):
        self.row = self.tanks.row(player_tank_id(player))
        if self.row is None:
            return
        self.totals = BattleTotals()
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(feedback, 'onPlayerSummaryFeedbackReceived', self._on_summary)
        self.render()

    def stop(self):
        self.totals = None
        self.row = None

    # onPlayerFeedbackReceived carries only the player's own events (feedback_adaptor, RU 1.45).
    def _on_feedback(self, events):
        if self.totals is None:
            return
        changed = False
        for event in events:
            key = self.kinds.get(event.getBattleEventType())
            if key is None:
                continue
            if key == 'def':
                # RU 1.45 client source: the extra of BASE_CAPTURE_DROPPED is the plain points count (feedback_events._unpackInteger),
                # which the defence ribbon shows (ribbons_aggregator._BaseCaptureRibbon).
                extra = event.getExtra()
                changed = self.totals.add(key, extra if is_number(extra) else call(event, 'getCount', 0)) or changed
            elif is_enemy(event.getTargetID()):
                changed = self.totals.add(key, call(event.getExtra(), 'getDamage', 0) if key == 'damage' else 1) or changed
        if changed:
            self.render()

    def _on_summary(self, event):
        if self.totals is not None and self.totals.raise_to('damage', call(event, 'getTotalDamage')):
            self.render()

    @safe
    def render(self):
        if self.totals is None:
            return
        state = panel_state(self.totals.values, self.row)
        text = format_panel(state, self.settings, self.app.translate)
        if text:
            self.show(text, panel_widget(state, self.settings, self.app.translate))
        else:
            self.hide()
