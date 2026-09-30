from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.compat import is_number, string_types, to_text
from .constants import BOOK_VERSION, COUNTERS, DAY_FORMAT, MAX_BATTLES, MAX_TEXT, SPG

# Fair play: only fire on the player's own vehicle, from the own damage feedback and the own vehicle's hit effects;
# the shooter's class is the one the stock damage log and player panels show. No SPG positions, tracers or aim are
# read (Lesta's forbidden list: an artillery meter built on tracers is banned, this one is not).


def is_artillery(vehicle_class):
    return vehicle_class == SPG


def _is_positive(value):
    return is_number(value) and value > 0


def _count(value):
    return int(value) if _is_positive(value) else 0


def _text(value):
    if not isinstance(value, string_types) or not value:
        return u''
    return to_text(value)[:MAX_TEXT]


# The artillery fire of one battle: direct hits and splash (the own vehicle's hit effects), damage and damaged modules
# (the own damage feedback), stuns (the own vehicle state).
class ArtyBattle(object):

    def __init__(self, arena_map=None, tank=None):
        self.map = _text(arena_map)
        self.tank = _text(tank)
        self.counts = dict((key, 0) for key in COUNTERS)
        self.stun_end = None

    def stun(self, end_time, duration):
        if not _is_positive(end_time) or not _is_positive(duration):
            return False
        if end_time == self.stun_end:
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


def _stored_battles(store):
    data = store.read({}) if store is not None else {}
    battles = data.get('battles') if isinstance(data, dict) else None
    if not isinstance(battles, list):
        return []
    return [entry for entry in map(clean_entry, battles) if entry is not None]


# The battles the player fought, with the artillery fire on the own vehicle, newest last; the last `keep`.
class ArtyBook(object):

    def __init__(self, store, keep):
        self.store = store
        self.keep = max(1, min(int(keep), MAX_BATTLES))
        self.battles = _stored_battles(store)[-self.keep:]

    def save(self):
        self.store.write({'version': BOOK_VERSION, 'battles': self.battles})

    def record(self, battle, at):
        entry = clean_entry(dict(battle.counts, t=at, map=battle.map, tank=battle.tank))
        self.battles.append(entry)
        del self.battles[:-self.keep]
        return entry

    def day(self, now):
        today = day_of(now)
        todays = [entry for entry in self.battles if day_of(entry['t']) == today]

        totals = dict((key, sum(entry[key] for entry in todays)) for key in COUNTERS)
        totals['battles'] = len(todays)
        return totals

    def clear(self):
        had = bool(self.battles)
        self.battles = []
        return had

    def recent(self, limit):
        if limit <= 0:
            return []
        return list(reversed(self.battles[-limit:]))
