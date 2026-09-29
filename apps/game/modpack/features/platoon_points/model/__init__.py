from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number, string_types, to_text
from .constants import MAX_NAME

# Fair play: the player's own damage and assist; for platoon mates only what the stock UI shows every player in battle:
# frags (the kill feed and Tab), alive state and HP (team panels, markers). The mates' damage is not known to the client
# in battle and is never estimated.


def rules_of(settings):
    return {'damage': settings.get('damage_step'), 'assist': settings.get('assist_step'), 'frag': settings.get('frag_points'),
            'alive': settings.get('alive_points')}


def points(rules, damage, assist, frags, alive):
    total = frags * rules['frag'] + (rules['alive'] if alive else 0)
    if damage is not None and rules['damage'] > 0:
        total += int(damage) // rules['damage']
    if assist is not None and rules['assist'] > 0:
        total += int(assist) // rules['assist']
    return total


class Platoon(object):

    def __init__(self):
        self.members = {}
        self.order = []
        self.damage = 0
        self.assist = 0
        self.summary = {}

    def add(self, vehicle_id, name, own, vehicle_class, max_hp, alive=True):
        if not is_int(vehicle_id):
            return False
        if vehicle_id not in self.members:
            self.order.append(vehicle_id)
        known = self.members.get(vehicle_id) or {}
        max_hp = int(max_hp) if is_number(max_hp) and max_hp > 0 else 0
        self.members[vehicle_id] = {
            'name': to_text(name)[:MAX_NAME] if isinstance(name, string_types) and name else u'?',
            'own': bool(own),
            'class': vehicle_class,
            'max': max_hp,
            'hp': known.get('hp', max_hp) if alive else 0,
            'alive': bool(alive),
            'frags': known.get('frags', 0),
        }
        return True

    def set_health(self, vehicle_id, hp):
        member = self.members.get(vehicle_id)
        if member is None or not is_number(hp):
            return False
        hp = max(0, min(member['max'] or int(hp), int(hp)))
        if hp == member['hp']:
            return False
        member['hp'] = hp
        return True

    def killed(self, victim_id, killer_id, victim_is_enemy):
        changed = False
        victim = self.members.get(victim_id)
        if victim is not None and victim['alive']:
            victim['alive'], victim['hp'] = False, 0
            changed = True
        killer = self.members.get(killer_id)
        if killer is not None and victim_is_enemy:
            killer['frags'] += 1
            changed = True
        return changed

    def add_own(self, kind, amount):
        if not is_number(amount) or amount <= 0 or kind not in ('damage', 'assist'):
            return False
        setattr(self, kind, getattr(self, kind) + int(amount))
        return True

    def apply_summary(self, damage=None, assist=None):
        changed = False
        for key, value in (('damage', damage), ('assist', assist)):
            if is_number(value) and value >= 0 and self.summary.get(key) != int(value):
                self.summary[key] = int(value)
                changed = True
        return changed

    def own_totals(self):
        return max(self.damage, self.summary.get('damage', 0)), max(self.assist, self.summary.get('assist', 0))

    def is_platoon(self):
        return len(self.members) > 1

    def rows(self, rules, with_mates=True):
        damage, assist = self.own_totals()
        rows = []
        for vehicle_id in self.order:
            member = self.members[vehicle_id]
            if not member['own'] and not with_mates:
                continue
            own_damage = damage if member['own'] else None
            own_assist = assist if member['own'] else None
            rows.append(dict(member, damage=own_damage, assist=own_assist,
                             points=points(rules, own_damage, own_assist, member['frags'], member['alive'])))
        rows.sort(key=lambda row: not row['own'])
        return rows
