from __future__ import absolute_import, division, print_function, unicode_literals

from . import TeamHp, format_panel
from .constants import PREVIEW_TEAM, PREVIEW_VEHICLES
from .widget import team_hp_widget


def preview_teams():
    teams = TeamHp(PREVIEW_TEAM)
    for vehicle_id, team, max_hp, hp, alive, kind in PREVIEW_VEHICLES:
        teams.add(vehicle_id, team, max_hp, alive, kind)
        teams.set_health(vehicle_id, hp)
    return teams


def preview_text(settings, translate):
    return format_panel(preview_teams(), settings, translate)


def preview_widget(settings, translate):
    return team_hp_widget(preview_teams(), settings)
