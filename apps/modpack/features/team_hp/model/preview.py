from __future__ import absolute_import, division, print_function, unicode_literals

from . import TeamHp, format_team_hp
from .constants import PREVIEW_TEAM, PREVIEW_VEHICLES


def preview_teams():
    teams = TeamHp(PREVIEW_TEAM)
    for vehicle_id, team, max_hp, hp, alive in PREVIEW_VEHICLES:
        teams.add(vehicle_id, team, max_hp, alive)
        teams.set_health(vehicle_id, hp)
    return teams


def preview_text(settings, translate):
    return format_team_hp(preview_teams().values(), settings, translate)
