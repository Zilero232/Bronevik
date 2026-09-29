from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.classes import CLASS_KEYS, class_key
from ....core.compat import is_number, string_types, to_text
from .constants import (AXES, BOOK_VERSION, DAMAGE_WINDOW_S, DAMAGING, MAX_BATTLES, MAX_HITS, MIDDLE, OUTCOMES, PART_NAMES, PART_ORDER,
                        SIDES)
from .points import impact, side_of


def _near(first, second):
    return first is None or second is None or abs(first - second) <= DAMAGE_WINDOW_S


def _text(value):
    return to_text(value) if isinstance(value, string_types) and value else None


# The book file may be damaged or edited by hand: what is read back is checked like what the book writes.
def clean_hit(entry):
    if not isinstance(entry, dict) or entry.get('part') not in PART_NAMES or entry.get('outcome') not in OUTCOMES:
        return None
    hit = {'part': entry['part'], 'outcome': entry['outcome'], 'attacker': _text(entry.get('attacker')),
           'class': entry.get('class') if entry.get('class') in CLASS_KEYS.values() else None,
           'damage': int(entry['damage']) if is_number(entry.get('damage')) and entry['damage'] > 0 else 0}
    for axis in AXES:
        value = entry.get(axis)
        hit[axis] = min(1.0, max(0.0, float(value))) if is_number(value) else MIDDLE
    return hit


def clean_battle(battle):
    if not isinstance(battle, dict) or not isinstance(battle.get('hits'), list):
        return None
    battle_id = battle.get('id')
    if not (isinstance(battle_id, string_types) and battle_id) and not is_number(battle_id):
        return None
    hits = [hit for hit in (clean_hit(entry) for entry in battle['hits'][:MAX_HITS]) if hit is not None]
    if not hits:
        return None
    return {'id': to_text(battle_id), 'vehicle': _text(battle.get('vehicle')), 't': battle.get('t') if is_number(battle.get('t')) else None,
            'hits': hits}


class HitBook(object):
    """The hits on the own tank per battle: `start` when the own battle is ready, `hit` and `damage` while it runs,
    `finish` when it ends (a battle without hits is not kept). The last `keep` battles are stored."""

    def __init__(self, store, keep):
        self.store = store
        self.keep = max(1, min(int(keep), MAX_BATTLES))
        data = store.read({}) if store is not None else {}
        battles = data.get('battles') if isinstance(data, dict) else None
        cleaned = (clean_battle(battle) for battle in (battles if isinstance(battles, list) else []))
        self.battles = [battle for battle in cleaned if battle is not None][-self.keep:]
        self.current = None
        self.pending = []

    def start(self, battle_id, vehicle, at):
        self.current = {'id': to_text(battle_id), 'vehicle': to_text(vehicle) if vehicle else None, 't': at, 'hits': []}
        self.pending = []

    def hit(self, segments, attacker=None, vehicle_class=None, at=None):
        if self.current is None or len(self.current['hits']) >= MAX_HITS:
            return False
        found = impact(segments)
        if found is None:
            return False
        part, outcome, (x, y, z) = found
        attacker = to_text(attacker) if attacker else None
        entry = {'part': part, 'outcome': outcome, 'x': x, 'y': y, 'z': z, 'attacker': attacker, 'class': class_key(vehicle_class),
                 'damage': 0, 'at': at}
        if outcome in DAMAGING:
            entry['damage'] = self._take_pending(attacker, at)
        self.current['hits'].append(entry)
        return True

    def _take_pending(self, attacker, at):
        for index, (who, amount, when) in enumerate(self.pending):
            if who == attacker and _near(at, when):
                del self.pending[index]
                return amount
        return 0

    def damage(self, attacker, amount, at=None):
        if self.current is None or not is_number(amount) or amount <= 0:
            return False
        attacker = to_text(attacker) if attacker else None
        for entry in reversed(self.current['hits']):
            if not _near(at, entry['at']):
                break
            if entry['outcome'] in DAMAGING and not entry['damage'] and entry['attacker'] == attacker:
                entry['damage'] = int(amount)
                return True
        self.pending = [item for item in self.pending if _near(at, item[2])] + [(attacker, int(amount), at)]
        return False

    def finish(self):
        current, self.current = self.current, None
        self.pending = []
        if current is None or not current['hits']:
            return None
        for entry in current['hits']:
            entry.pop('at', None)
        self.battles.append(current)
        del self.battles[:-self.keep]
        return current

    def resize(self, keep):
        self.keep = max(1, min(int(keep), MAX_BATTLES))
        del self.battles[:-self.keep]

    def latest(self):
        return self.battles[-1] if self.battles else None

    def ordered(self):
        return list(reversed(self.battles))

    def clear(self, battle_id):
        before = len(self.battles)
        self.battles = [battle for battle in self.battles if battle.get('id') != battle_id]
        return len(self.battles) != before

    def save(self):
        if self.store is not None:
            self.store.write({'version': BOOK_VERSION, 'battles': self.battles})


def summary(battle):
    """Counts of one battle: hits, each outcome, the damage, and per part (with the hull and turret sides)."""
    hits = battle.get('hits') or []
    counts = dict((outcome, 0) for outcome in OUTCOMES)
    parts = dict((part, 0) for part in PART_ORDER)
    sides = dict((part, dict((side, 0) for side in SIDES)) for part in PART_ORDER)
    damage = 0
    for entry in hits:
        if entry.get('outcome') in counts:
            counts[entry['outcome']] += 1
        part = entry.get('part')
        if part in parts:
            parts[part] += 1
            side = side_of(part, entry.get('x', 0.5), entry.get('z', 0.5))
            if side is not None:
                sides[part][side] += 1
        if is_number(entry.get('damage')):
            damage += int(entry['damage'])
    return {'hits': len(hits), 'counts': counts, 'parts': parts, 'sides': sides, 'damage': damage}
