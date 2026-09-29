from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.compat import is_number, string_types, to_text
from .constants import BOOK_VERSION, COUNTERS, DAY_FORMAT, MAX_BATTLES, MAX_TEXT, SPG

# Fair play: only fire on the player's own vehicle, from the own damage feedback and the own vehicle's hit effects; the
# shooter's class is the one the stock damage log and player panels show. No SPG positions, tracers or aim are read
# (Lesta's forbidden list: an artillery meter built on tracers is banned, this one is not).


def is_artillery(vehicle_class):
    return vehicle_class == SPG


def _count(value):
    return int(value) if is_number(value) and value > 0 else 0


def _text(value):
    return to_text(value)[:MAX_TEXT] if isinstance(value, string_types) and value else u''


class ArtyBattle(object):
    """The artillery fire of one battle: direct hits and splash (the own vehicle's hit effects), damage and damaged
    modules (the own damage feedback), stuns (the own vehicle state)."""

    def __init__(self, arena_map=None, tank=None):
        self.map = _text(arena_map)
        self.tank = _text(tank)
        self.counts = dict((key, 0) for key in COUNTERS)
        self.stun_end = None

    def stun(self, end_time, duration):
        if not is_number(end_time) or not is_number(duration) or end_time <= 0 or duration <= 0 or end_time == self.stun_end:
            return False
        self.stun_end = end_time
        return self.add('stuns')

    def add(self, key, amount=1):
        amount = _count(amount)
        if key not in self.counts or not amount:
            return False
        self.counts[key] += amount
        return True

    @property
    def total(self):
        return self.counts['hits'] + self.counts['splash']

    def values(self):
        values = dict(self.counts)
        values['total'] = self.total
        return values


def clean_entry(entry):
    if not isinstance(entry, dict) or not is_number(entry.get('t')):
        return None
    cleaned = {'t': int(entry['t']), 'map': _text(entry.get('map')), 'tank': _text(entry.get('tank'))}
    for key in COUNTERS:
        cleaned[key] = _count(entry.get(key))
    return cleaned


def day_of(moment):
    return time.strftime(DAY_FORMAT, time.localtime(moment))


class ArtyBook(object):
    """The battles the player fought, with the artillery fire on the own vehicle, newest last; the last `keep`."""

    def __init__(self, store, keep):
        self.store = store
        self.keep = max(1, min(int(keep), MAX_BATTLES))
        data = store.read({}) if store is not None else {}
        battles = data.get('battles') if isinstance(data, dict) else None
        cleaned = (clean_entry(entry) for entry in (battles if isinstance(battles, list) else []))
        self.battles = [entry for entry in cleaned if entry is not None][-self.keep:]

    def save(self):
        self.store.write({'version': BOOK_VERSION, 'battles': self.battles})

    def record(self, battle, at):
        entry = clean_entry(dict(battle.counts, t=at, map=battle.map, tank=battle.tank))
        self.battles.append(entry)
        del self.battles[:-self.keep]
        return entry

    def day(self, now):
        today = day_of(now)
        totals = dict((key, 0) for key in COUNTERS)
        totals['battles'] = 0
        for entry in self.battles:
            if day_of(entry['t']) == today:
                totals['battles'] += 1
                for key in COUNTERS:
                    totals[key] += entry[key]
        return totals

    def clear(self):
        had = bool(self.battles)
        self.battles = []
        return had

    def recent(self, limit):
        return list(reversed(self.battles[-limit:])) if limit > 0 else []
