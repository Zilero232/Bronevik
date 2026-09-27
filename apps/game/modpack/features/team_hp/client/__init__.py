from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import arena, arena_dp, call, feedback, vehicle_state
from ....core.client.hud.panel import BattlePanel
from ....core.log import safe
from ..i18n import STRINGS
from ..model import TeamHp, format_team_hp
from ..model.constants import PREVIEW_SIZE
from ..model.preview import preview_text
from ..settings import PANEL_ID, SCHEMA, SWITCH

try:
    from gui.battle_control.battle_constants import FEEDBACK_EVENT_ID, VEHICLE_VIEW_STATE
except ImportError:
    FEEDBACK_EVENT_ID = None
    VEHICLE_VIEW_STATE = None


def own_team(player):
    team = getattr(player, 'team', None)
    if team is None:
        team = call(arena_dp(), 'getNumberOfTeam')
    return team


class TeamHpPanel(BattlePanel):

    def __init__(self, app):
        self.health_event = getattr(FEEDBACK_EVENT_ID, 'VEHICLE_HEALTH', None)
        self.dead_event = getattr(FEEDBACK_EVENT_ID, 'VEHICLE_DEAD', None)
        self.health_state = getattr(VEHICLE_VIEW_STATE, 'HEALTH', None)
        self.teams = None
        self.unknown = set()
        BattlePanel.__init__(self, app, PANEL_ID, SCHEMA, SWITCH, STRINGS, PREVIEW_SIZE, preview_text)

    def start(self, player):
        self.teams = TeamHp(own_team(player))
        self.unknown = set()
        self.hooks.add(feedback, 'onVehicleFeedbackReceived', self._on_vehicle_feedback)
        self.hooks.add(vehicle_state, 'onVehicleStateUpdated', self._on_vehicle_state)
        self.hooks.add(arena, 'onVehicleKilled', self._on_vehicle_killed)
        self.hooks.add(arena, 'onVehicleAdded', self._on_vehicle_added)
        self.sync()

    def stop(self):
        self.teams = None

    def sync(self):
        provider = arena_dp()
        if self.teams is None or provider is None:
            return
        for info in provider.getVehiclesInfoIterator():
            vehicle_type = getattr(info, 'vehicleType', None)
            self.teams.add(info.vehicleID, info.team, getattr(vehicle_type, 'maxHealth', None), bool(call(info, 'isAlive', True)))
        self.render()

    def _on_vehicle_added(self, vehicle_id, *args):
        self.sync()

    def _on_vehicle_feedback(self, event_id, vehicle_id, value):
        if self.teams is None:
            return
        if vehicle_id not in self.teams.vehicles and vehicle_id not in self.unknown:
            self.unknown.add(vehicle_id)
            self.sync()
        changed = False
        if event_id == self.health_event and isinstance(value, (list, tuple)) and value:
            changed = self.teams.set_health(vehicle_id, value[0])
        elif event_id == self.dead_event:
            changed = self.teams.kill(vehicle_id)
        if changed:
            self.render()

    def _on_vehicle_state(self, state, value):
        if self.teams is None or state != self.health_state or self.health_state is None:
            return
        if self.teams.set_health(call(vehicle_state(), 'getControllingVehicleID'), value):
            self.render()

    def _on_vehicle_killed(self, victim_id, *args):
        if self.teams is not None and self.teams.kill(victim_id):
            self.render()

    @safe
    def render(self):
        if self.teams is not None and self.teams.vehicles:
            self.show(format_team_hp(self.teams.values(), self.settings, self.app.translate))
