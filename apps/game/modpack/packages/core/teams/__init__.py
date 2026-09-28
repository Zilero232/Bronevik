# -*- coding: utf-8 -*-
"""HP of both teams as the client already shows it (the team panels, the vehicle markers), shared by the team HP
panel and the «Основной калибр» counter. Pure; the client glue that feeds it is `core/client/battle/teams`.

Fair play: max HP from the arena data behind the player panels, current HP from the health updates the client
receives (an unseen enemy keeps its last known HP, as on its marker), deaths from the arena."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import is_int, is_number, string_types, to_text


class TeamHp(object):

    def __init__(self, own_team):
        self.own_team = own_team
        self.vehicles = {}
        self.order = []

    def add(self, vehicle_id, team, max_hp, alive=True, kind=None):
        """Adds or refreshes a vehicle; `kind` is its class tag (lightTank, AT-SPG, ...) as the player panels show it."""
        if not is_int(vehicle_id) or not is_int(team) or not is_number(max_hp) or max_hp <= 0:
            return False
        known = self.vehicles.get(vehicle_id)
        hp = known['hp'] if known is not None else int(max_hp)
        if known is None:
            self.order.append(vehicle_id)
        self.vehicles[vehicle_id] = {'team': team, 'max': int(max_hp), 'hp': min(hp, int(max_hp)), 'alive': bool(alive),
                                     'kind': to_text(kind) if isinstance(kind, string_types) else None}
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

    def is_ally(self, vehicle_id):
        vehicle = self.vehicles.get(vehicle_id)
        return vehicle is not None and vehicle['team'] == self.own_team

    def team(self, allies):
        """The vehicles of one side in the order they joined the arena: [{team, max, hp, alive, kind}]."""
        return [self.vehicles[vehicle_id] for vehicle_id in self.order
                if vehicle_id in self.vehicles and (self.vehicles[vehicle_id]['team'] == self.own_team) == allies]

    def totals(self, allies):
        hp = max_hp = alive = count = 0
        for vehicle in self.team(allies):
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
