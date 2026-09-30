from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import as_int, is_int, string_types, to_text
from .constants import (
    ASSIST_STATS,
    CLASS_TAGS,
    HISTORY_VERSION,
    ITEM_CODE,
    MAX_VEHICLES,
    READING_KEYS,
    SOURCE_BATTLE,
    SOURCE_HANGAR,
)


def vehicle_label(name):
    if not isinstance(name, string_types) or not name:
        return u''
    short = to_text(name).split(':', 1)[-1]
    return ITEM_CODE.sub(u'', short) or short


def percent(rating):
    if not is_int(rating):
        return None
    return round(rating / 100.0, 2)


def rating_delta(before, after):
    first = percent(before.get('rating')) if before else None
    last = percent(after.get('rating'))
    if first is None or last is None:
        return None
    return round(last - first, 2)


def _is_recordable(tank_id, dossier):
    if not is_int(tank_id) or not is_int(dossier.get('damage_rating')):
        return False
    return bool(dossier.get('moving_avg_damage'))


# `dossier` is the moe block of a battle event or a hangar snapshot: both carry the own dossier values.
def _entry(time_s, dossier, source):
    return {
        't': int(time_s),
        'rating': dossier['damage_rating'],
        'avg': dossier['moving_avg_damage'],
        'marks': dossier.get('marks_on_gun'),
        'source': source,
        'arena': None,
        'damage': None,
        'combined': None,
        'result': None,
    }


def _battle_entry(event, moe):
    stats = event.get('stats') or {}
    damage = as_int(stats.get('damage_dealt'))
    best_assist = max(as_int(stats.get(key)) for key in ASSIST_STATS)

    entry = _entry(event.get('occurred_at') or 0, moe, SOURCE_BATTLE)
    entry['arena'] = event.get('arena_unique_id')
    entry['damage'] = damage
    entry['combined'] = damage + best_assist
    entry['result'] = event.get('result')
    return entry


def _same_reading(entry, other):
    return all(entry.get(key) == other.get(key) for key in READING_KEYS)


def _note_reached(vehicle, previous, entry):
    marks = entry['marks']
    if not is_int(marks):
        return
    reached = vehicle.setdefault('reached', {})
    before = previous.get('marks') if previous else None
    if not is_int(before):
        return
    for mark in range(max(before, 0) + 1, marks + 1):
        reached.setdefault(str(mark), entry['t'])


def _battle_indexes(entries):
    return [index for index, item in enumerate(entries) if index > 0 and item.get('source') == SOURCE_BATTLE]


def _span_delta(entries, indexes):
    if not indexes:
        return None
    return rating_delta(entries[indexes[0] - 1], entries[indexes[-1]])


class MarksHistory(object):

    def __init__(self, store, max_entries=100):
        self.store = store
        self.max_entries = max_entries
        data = store.read({}) or {}
        vehicles = data.get('vehicles') if isinstance(data, dict) else None
        self.vehicles = dict((key, value) for key, value in (vehicles or {}).items() if isinstance(value, dict))

    def save(self):
        self.store.write({'version': HISTORY_VERSION, 'vehicles': self.vehicles})

    def vehicle(self, tank_id):
        return self.vehicles.get(str(tank_id))

    def _entries(self, tank_id):
        known = self.vehicle(tank_id)
        if not known:
            return []
        return known.get('entries') or []

    def _vehicle_for(self, tank_id, label, tier, kind):
        blank = {'label': label or u'', 'tier': tier, 'entries': [], 'reached': {}}
        vehicle = self.vehicles.setdefault(str(tank_id), blank)
        if label:
            vehicle['label'] = label
        if kind in CLASS_TAGS:
            vehicle['class'] = kind
        if is_int(tier):
            vehicle['tier'] = tier
        return vehicle

    def _record(self, vehicle, entry):
        entries = vehicle.setdefault('entries', [])
        previous = entries[-1] if entries else None
        _note_reached(vehicle, previous, entry)

        entries.append(entry)
        del entries[:-self.max_entries]
        vehicle['updated'] = entry['t']
        self._forget_oldest()
        return entry

    def _forget_oldest(self):
        while len(self.vehicles) > MAX_VEHICLES:
            oldest = min(self.vehicles, key=lambda key: self.vehicles[key].get('updated') or 0)
            del self.vehicles[oldest]

    def _has_arena(self, tank_id, arena):
        if not arena:
            return False
        return any(item.get('arena') == arena for item in self._entries(tank_id))

    def record_battle(self, event, label=None, kind=None):
        moe = event.get('moe') or {}
        info = event.get('vehicle') or {}
        tank_id = info.get('tank_id')
        if not _is_recordable(tank_id, moe) or self._has_arena(tank_id, event.get('arena_unique_id')):
            return None

        entry = _battle_entry(event, moe)
        vehicle = self._vehicle_for(tank_id, label or vehicle_label(info.get('name')), info.get('tier'), kind)
        return self._record(vehicle, entry)

    def record_snapshot(self, snapshot, now, label=None, kind=None):
        tank_id = snapshot.get('tank_id')
        if not _is_recordable(tank_id, snapshot):
            return None
        entry = _entry(now, snapshot, SOURCE_HANGAR)
        entries = self._entries(tank_id)
        if entries and _same_reading(entries[-1], entry):
            return None

        vehicle = self._vehicle_for(tank_id, label or vehicle_label(snapshot.get('name')), snapshot.get('tier'), kind)
        return self._record(vehicle, entry)

    def clear(self, tank_id):
        return self.vehicles.pop(str(tank_id), None) is not None

    def summary(self, tank_id, trend_battles):
        entries = self._entries(tank_id)
        if not entries:
            return None
        vehicle = self.vehicle(tank_id)
        last = entries[-1]
        battles = _battle_indexes(entries)
        window = battles[-trend_battles:]

        return {
            'label': vehicle.get('label') or u'',
            'tier': vehicle.get('tier'),
            'percent': percent(last.get('rating')),
            'marks': last.get('marks'),
            'avg': last.get('avg'),
            'last_delta': _span_delta(entries, battles[-1:]),
            'trend': _span_delta(entries, window),
            'trend_battles': len(window),
            'reached': dict(vehicle.get('reached') or {}),
            'updated': vehicle.get('updated'),
        }

    def ordered(self):
        return sorted(self.vehicles, key=lambda key: -(self.vehicles[key].get('updated') or 0))
