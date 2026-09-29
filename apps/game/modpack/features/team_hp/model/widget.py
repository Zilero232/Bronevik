from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import class_icon
from ....core.hud.widget import widget
from .constants import KIND, STRIP_STYLES

# Fair play: the class icons, alive state and HP the stock score strip, player panels and markers already show; an
# unseen enemy keeps its last known HP, as on its marker.


def side(totals, frags):
    return {'hp': totals['hp'], 'max': totals['max'], 'alive': totals['alive'], 'count': totals['count'], 'frags': frags}


def vehicle_row(vehicle, tint):
    return {'icon': class_icon(vehicle.get('kind'), tint), 'hp': vehicle['hp'], 'max': vehicle['max'], 'alive': vehicle['alive']}


def team_hp_widget(teams, settings):
    values = teams.values()
    strip = settings.get('style') in STRIP_STYLES
    return widget(KIND, {
        'style': settings.get('style'),
        'allies': side(teams.totals(True), values['allies_frags']),
        'enemies': side(teams.totals(False), values['enemies_frags']),
        'show_score': bool(settings.get('show_score')),
        'diff': values['diff'] if settings.get('show_diff') else None,
        'colors': {'ally': settings.get('ally_color'), 'enemy': settings.get('enemy_color')},
        'vehicles': {
            'allies': [vehicle_row(vehicle, 'green') for vehicle in teams.team(True)] if strip else [],
            'enemies': [vehicle_row(vehicle, 'red') for vehicle in teams.team(False)] if strip else [],
        },
    })
