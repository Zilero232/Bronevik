from __future__ import absolute_import, division, print_function, unicode_literals

from .....core.classes import CLASS_KEYS, class_key
from .....core.compat import is_number, string_types, to_text
from .constants import (
    AXES,
    BOOK_VERSION,
    DAMAGE_WINDOW_S,
    DAMAGING,
    MAX_BATTLES,
    MAX_HITS,
    MIDDLE,
    OUTCOMES,
    PART_NAMES,
    PART_ORDER,
    SIDES,
)
from .points import impact, side_of


def _near(first, second):
    if first is None or second is None:
        return True
    return abs(first - second) <= DAMAGE_WINDOW_S


def _text(value):
    if isinstance(value, string_types) and value:
        return to_text(value)
    return None


def _optional_text(value):
    return to_text(value) if value else None


def _keep_count(keep):
    return max(1, min(int(keep), MAX_BATTLES))


def _fraction(value):
    if not is_number(value):
        return MIDDLE
    return min(1.0, max(0.0, float(value)))


def _positive_damage(value):
    if is_number(value) and value > 0:
        return int(value)
    return 0


def _is_battle_id(value):
    is_text_id = isinstance(value, string_types) and bool(value)
    return is_text_id or is_number(value)


# The book file may be damaged or edited by hand: what is read back is checked like what the book writes.
def clean_hit(entry):
    if not isinstance(entry, dict):
        return None
    if entry.get('part') not in PART_NAMES or entry.get('outcome') not in OUTCOMES:
        return None

    vehicle_class = entry.get('class')
    hit = {
        'part': entry['part'],
        'outcome': entry['outcome'],
        'attacker': _text(entry.get('attacker')),
        'class': vehicle_class if vehicle_class in CLASS_KEYS.values() else None,
        'damage': _positive_damage(entry.get('damage')),
    }
    for axis in AXES:
        hit[axis] = _fraction(entry.get(axis))
    return hit


def clean_battle(battle):
    if not isinstance(battle, dict) or not isinstance(battle.get('hits'), list):
        return None
    if not _is_battle_id(battle.get('id')):
        return None

    cleaned = (clean_hit(entry) for entry in battle['hits'][:MAX_HITS])
    hits = [hit for hit in cleaned if hit is not None]
    if not hits:
        return None

    started = battle.get('t')
    return {
        'id': to_text(battle['id']),
        'vehicle': _text(battle.get('vehicle')),
        't': started if is_number(started) else None,
        'hits': hits,
    }


def _stored_battles(store):
    data = store.read({}) if store is not None else {}
    battles = data.get('battles') if isinstance(data, dict) else None
    if not isinstance(battles, list):
        return []
    cleaned = (clean_battle(battle) for battle in battles)
    return [battle for battle in cleaned if battle is not None]


class HitBook(object):

    def __init__(self, store, keep):
        self.store = store
        self.keep = _keep_count(keep)
        self.battles = _stored_battles(store)[-self.keep:]
        self.current = None
        self.pending = []

    def start(self, battle_id, vehicle, at):
        self.current = {'id': to_text(battle_id), 'vehicle': _optional_text(vehicle), 't': at, 'hits': []}
        self.pending = []

    def hit(self, segments, attacker=None, vehicle_class=None, at=None):
        if self.current is None or len(self.current['hits']) >= MAX_HITS:
            return False
        found = impact(segments)
        if found is None:
            return False

        part, outcome, (x, y, z) = found
        attacker = _optional_text(attacker)
        entry = {
            'part': part,
            'outcome': outcome,
            'x': x,
            'y': y,
            'z': z,
            'attacker': attacker,
            'class': class_key(vehicle_class),
            'damage': 0,
            'at': at,
        }
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

    def _hit_waiting_for_damage(self, attacker, at):
        for entry in reversed(self.current['hits']):
            if not _near(at, entry['at']):
                return None
            is_damaging = entry['outcome'] in DAMAGING
            if is_damaging and not entry['damage'] and entry['attacker'] == attacker:
                return entry
        return None

    def damage(self, attacker, amount, at=None):
        if self.current is None or not is_number(amount) or amount <= 0:
            return False

        attacker = _optional_text(attacker)
        entry = self._hit_waiting_for_damage(attacker, at)
        if entry is not None:
            entry['damage'] = int(amount)
            return True

        still_pending = [item for item in self.pending if _near(at, item[2])]
        self.pending = still_pending + [(attacker, int(amount), at)]
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
        self.keep = _keep_count(keep)
        del self.battles[:-self.keep]

    def clear(self):
        self.battles = []

    def save(self):
        if self.store is not None:
            self.store.write({'version': BOOK_VERSION, 'battles': self.battles})


def _zero_counts(keys):
    return dict((key, 0) for key in keys)


def summary(battle):
    hits = battle.get('hits') or []
    counts = _zero_counts(OUTCOMES)
    parts = _zero_counts(PART_ORDER)
    sides = dict((part, _zero_counts(SIDES)) for part in PART_ORDER)
    damage = 0

    for entry in hits:
        if entry.get('outcome') in counts:
            counts[entry['outcome']] += 1
        part = entry.get('part')
        if part in parts:
            parts[part] += 1
            side = side_of(part, entry.get('x', MIDDLE), entry.get('z', MIDDLE))
            if side is not None:
                sides[part][side] += 1
        if is_number(entry.get('damage')):
            damage += int(entry['damage'])

    return {'hits': len(hits), 'counts': counts, 'parts': parts, 'sides': sides, 'damage': damage}
