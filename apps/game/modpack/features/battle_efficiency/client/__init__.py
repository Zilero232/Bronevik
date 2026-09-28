from __future__ import absolute_import, division, print_function, unicode_literals

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import call, feedback, is_enemy
from ....core.client.game import player_tank_id, selected_vehicle, values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.client.me import tank_ratings
from ....core.compat import is_number
from ....core.events import EVENT_COMPONENT_SETTINGS
from ....core.hooks import subscribe
from ....core.log import log_exception, safe
from ..i18n import STRINGS
from ..model import BattleTotals, format_panel, panel_state
from ..model.constants import KIND_BY_EVENT, PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH


class BattleEfficiencyPanel(BattlePanel):
    """This battle's WN8 estimate and damage against the own average on the tank. The tank's row (/mod/me/tanks:
    average, WN8, expected values) is read in the hangar when the vehicle is selected and kept for the battle."""

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.tanks = tank_ratings(app)
        self.totals = None
        self.row = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)
        app.bus.on('hangar', self._on_vehicle_changed)
        app.bus.on(EVENT_COMPONENT_SETTINGS, self._on_settings)
        try:
            from CurrentVehicle import g_currentVehicle
            subscribe(g_currentVehicle, 'onChanged', self._on_vehicle_changed)
        except Exception:
            log_exception('battle efficiency: current vehicle')

    def _on_vehicle_changed(self):
        if self.enabled_in_hangar():
            self.tanks.ensure(getattr(selected_vehicle(), 'intCD', None))

    def _on_settings(self, component_id, changed):
        if component_id == PANEL_ID:
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
                # UNVERIFIED on Lesta 1.45: the capture points reset arrive as the extra of BASE_CAPTURE_DROPPED.
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
        text = format_panel(panel_state(self.totals.values, self.row), self.settings, self.app.translate)
        if text:
            self.show(text)
        else:
            self.hide()
