from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number
from ....core.hud import render
from ....core.panels import COLOR_MUTED, COLOR_NEUTRAL, font, format_number
from .constants import BAR_CHAR


class TeamHp(object):
    """HP of both teams from what the client already shows: max HP from the arena data behind the player
    panels, current HP from the health updates the client receives (an unseen enemy keeps its last
    known HP, as on its marker), deaths from the arena."""

    def __init__(self, own_team):
        self.own_team = own_team
        self.vehicles = {}

    def add(self, vehicle_id, team, max_hp, alive=True):
        if not is_int(vehicle_id) or not is_int(team) or not is_number(max_hp) or max_hp <= 0:
            return False
        known = self.vehicles.get(vehicle_id)
        hp = known['hp'] if known is not None else int(max_hp)
        self.vehicles[vehicle_id] = {'team': team, 'max': int(max_hp), 'hp': min(hp, int(max_hp)), 'alive': bool(alive)}
        if not alive:
            self.vehicles[vehicle_id]['hp'] = 0
        return True

    def set_health(self, vehicle_id, hp):
        vehicle = self.vehicles.get(vehicle_id)
        if vehicle is None or not is_number(hp):
            return False
        hp = max(0, min(vehicle['max'], int(hp)))
        if hp == vehicle['hp']:
            return False
        vehicle['hp'] = hp
        return True

    def kill(self, vehicle_id):
        vehicle = self.vehicles.get(vehicle_id)
        if vehicle is None or not vehicle['alive']:
            return False
        vehicle['alive'] = False
        vehicle['hp'] = 0
        return True

    def totals(self, allies):
        hp = max_hp = alive = count = 0
        for vehicle in self.vehicles.values():
            if (vehicle['team'] == self.own_team) != allies:
                continue
            count += 1
            max_hp += vehicle['max']
            hp += vehicle['hp']
            alive += 1 if vehicle['alive'] else 0
        return {'hp': hp, 'max': max_hp, 'alive': alive, 'count': count}

    def values(self):
        allies = self.totals(True)
        enemies = self.totals(False)
        return {
            'allies_hp': allies['hp'],
            'allies_max': allies['max'],
            'allies_alive': allies['alive'],
            'enemies_hp': enemies['hp'],
            'enemies_max': enemies['max'],
            'enemies_alive': enemies['alive'],
            'allies_frags': enemies['count'] - enemies['alive'],
            'enemies_frags': allies['count'] - allies['alive'],
            'diff': allies['hp'] - enemies['hp'],
        }


def bar(value, maximum, width, color):
    filled = int(round(width * value / maximum)) if maximum > 0 else 0
    filled = max(0, min(width, filled))
    return font(BAR_CHAR * filled, color) + font(BAR_CHAR * (width - filled), COLOR_MUTED)


def signed(value):
    return ('+' if value > 0 else '') + format_number(value)


def format_team_hp(values, settings, translate):
    if settings.get('template'):
        return font(render(settings.get('template'), values), COLOR_NEUTRAL, settings.get('font_size'))
    style = settings.get('style')
    ally = settings.get('ally_color')
    enemy = settings.get('enemy_color')
    width = settings.get('bar_width')
    allies_hp = font(format_number(values['allies_hp']), ally)
    enemies_hp = font(format_number(values['enemies_hp']), enemy)
    parts = []
    if style in ('full', 'bars'):
        parts.append(bar(values['allies_hp'], values['allies_max'], width, ally))
    if style in ('full', 'numbers', 'compact'):
        parts.append(allies_hp)
    if settings.get('show_score'):
        parts.append(font('%d : %d' % (values['allies_frags'], values['enemies_frags']), COLOR_NEUTRAL))
    elif style == 'compact':
        parts.append(font(':', COLOR_MUTED))
    if style in ('full', 'numbers', 'compact'):
        parts.append(enemies_hp)
    if style in ('full', 'bars'):
        parts.append(bar(values['enemies_hp'], values['enemies_max'], width, enemy))
    lines = [font('  '.join(parts), COLOR_NEUTRAL, settings.get('font_size'))]
    if settings.get('show_diff') and style != 'compact':
        color = ally if values['diff'] >= 0 else enemy
        lines.append(font(translate('team_hp_diff', diff=signed(values['diff'])), color, max(8, settings.get('font_size') - 2)))
    return '\n'.join(lines)
