from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import class_icon
from ....core.hud.widget import widget
from .constants import KIND, STRIP_STYLES
from .strip import strip_rows

# Fair play: the class icons, tiers, alive state and HP the stock score strip, player panels and markers already show;
# an unseen enemy keeps its last known HP, as on its marker.


def side(health, totals, frags):
    return {
        'hp': health['hp'],
        'max': health['max'],
        'alive': totals['alive'],
        'count': totals['count'],
        'frags': frags,
    }


def vehicle_row(vehicle, tier, tint, options):
    icon = class_icon(vehicle.get('kind'), tint) if options['icons'] else None
    return {'icon': icon, 'tier': tier, 'hp': vehicle['hp'], 'max': vehicle['max'], 'alive': vehicle['alive']}


def strip_vehicles(teams, allies, tint, options):
    return [vehicle_row(vehicle, tier, tint, options) for vehicle, tier in strip_rows(teams, allies, options)]


def team_hp_widget(teams, settings, options):
    values = teams.values()
    strip = settings.get('style') in STRIP_STYLES
    return widget(KIND, {
        'style': settings.get('style'),
        'allies': side(teams.health(True), teams.totals(True), values['allies_frags']),
        'enemies': side(teams.health(False), teams.totals(False), values['enemies_frags']),
        'show_score': bool(settings.get('show_score')),
        'score_alive': bool(settings.get('show_alive')),
        'diff': values['diff'] if settings.get('show_diff') else None,
        'colors': {'ally': settings.get('ally_color'), 'enemy': settings.get('enemy_color')},
        'vehicles': {
            'allies': strip_vehicles(teams, True, 'green', options) if strip else [],
            'enemies': strip_vehicles(teams, False, 'red', options) if strip else [],
        },
    })
