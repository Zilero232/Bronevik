from __future__ import absolute_import, division, print_function, unicode_literals

from BattleFeedbackCommon import BATTLE_EVENT_TYPE

from ....core.client.battle import arena, arena_dp, call, feedback, is_enemy, summary_assist, vehicle_state
from ....core.client.game import values_by_name
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import Platoon
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text, preview_widget
from ..model.text import points_text
from ..model.widget import points_widget
from ..settings import PANEL_ID, SCHEMA, SWITCH
from .constants import KIND_BY_EVENT

try:
    from gui.battle_control.battle_constants import FEEDBACK_EVENT_ID, VEHICLE_VIEW_STATE
except ImportError:
    FEEDBACK_EVENT_ID = None
    VEHICLE_VIEW_STATE = None


class PlatoonPointsPanel(BattlePanel):
    """Tournament-style points. The own damage and assist from the own feedback (raised to the client's summary); the
    platoon from the arena data (arena_dp.isSquadMan), its frags from the arena's kills (the kill feed), HP from the
    health updates the client receives for the team panels and markers."""

    def __init__(self, app):
        self.kinds = values_by_name(BATTLE_EVENT_TYPE, KIND_BY_EVENT)
        self.health_event = getattr(FEEDBACK_EVENT_ID, 'VEHICLE_HEALTH', None)
        self.health_state = getattr(VEHICLE_VIEW_STATE, 'HEALTH', None)
        self.platoon = None
        self.own_id = None
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text, preview_widget)

    def start(self, player):
        self.platoon = Platoon()
        self.own_id = getattr(player, 'playerVehicleID', None)
        provider = arena_dp()
        for info in (call(provider, 'getVehiclesInfoIterator', []) or []):
            vehicle_id = getattr(info, 'vehicleID', None)
            own = vehicle_id == self.own_id
            if own or bool(call(provider, 'isSquadMan', False, vehicle_id)):
                vehicle_type = getattr(info, 'vehicleType', None)
                self.platoon.add(vehicle_id, getattr(getattr(info, 'player', None), 'name', None), own, getattr(vehicle_type, 'classTag', None),
                                 getattr(vehicle_type, 'maxHealth', None), bool(call(info, 'isAlive', True)))
        self.hooks.add(feedback, 'onPlayerFeedbackReceived', self._on_feedback)
        self.hooks.add(feedback, 'onPlayerSummaryFeedbackReceived', self._on_summary)
        self.hooks.add(feedback, 'onVehicleFeedbackReceived', self._on_vehicle_feedback)
        self.hooks.add(vehicle_state, 'onVehicleStateUpdated', self._on_vehicle_state)
        self.hooks.add(arena, 'onVehicleKilled', self._on_killed)
        self.render()

    def stop(self):
        self.platoon = None

    def _on_feedback(self, events):
        if self.platoon is None:
            return
        changed = False
        for event in events:
            kind = self.kinds.get(event.getBattleEventType())
            if kind is None or (kind == 'damage' and not is_enemy(event.getTargetID())):
                continue
            changed = self.platoon.add_own(kind, call(event.getExtra(), 'getDamage', 0)) or changed
        if changed:
            self.render()

    def _on_summary(self, event):
        if self.platoon is not None and self.platoon.apply_summary(call(event, 'getTotalDamage'), summary_assist(event)):
            self.render()

    def _on_vehicle_feedback(self, event_id, vehicle_id, value):
        if self.platoon is None or event_id != self.health_event or not isinstance(value, (list, tuple)) or not value:
            return
        if self.platoon.set_health(vehicle_id, value[0]):
            self.render()

    # HEALTH follows the controlled vehicle: after death it is the health of the ally the camera follows (RU 1.45
    # vehicle_state_ctrl), so it goes to that vehicle, as the team HP panel does.
    def _on_vehicle_state(self, state, value):
        if self.platoon is None or self.health_state is None or state != self.health_state:
            return
        if self.platoon.set_health(call(vehicle_state(), 'getControllingVehicleID'), value):
            self.render()

    def _on_killed(self, victim_id, killer_id, *args):
        if self.platoon is not None and self.platoon.killed(victim_id, killer_id, is_enemy(victim_id)):
            self.render()

    @safe
    def render(self):
        if self.platoon is None:
            return
        if not self.platoon.is_platoon() and not self.settings.get('show_solo'):
            self.hide()
            return
        self.show(points_text(self.platoon, self.settings, self.app.translate), points_widget(self.platoon, self.settings))
