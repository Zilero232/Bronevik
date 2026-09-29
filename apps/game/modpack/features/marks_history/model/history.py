from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import as_int, is_int, string_types, to_text
from .constants import CLASS_TAGS, HISTORY_VERSION, ITEM_CODE, MAX_VEHICLES, SOURCE_BATTLE, SOURCE_HANGAR


def vehicle_label(name):
    if not isinstance(name, string_types) or not name:
        return u''
    short = to_text(name).split(':', 1)[-1]
    return ITEM_CODE.sub(u'', short) or short


def percent(rating):
    return round(rating / 100.0, 2) if is_int(rating) else None


def _entry(time_s, rating, moving_avg, marks, source, arena=None, damage=None, combined=None, result=None):
    return {'t': int(time_s), 'rating': rating, 'avg': moving_avg, 'marks': marks, 'source': source, 'arena': arena,
            'damage': damage, 'combined': combined, 'result': result}


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

    def _record(self, tank_id, label, tier, entry, kind=None):
        vehicle = self.vehicles.setdefault(str(tank_id), {'label': label or u'', 'tier': tier, 'entries': [], 'reached': {}})
        if label:
            vehicle['label'] = label
        if kind in CLASS_TAGS:
            vehicle['class'] = kind
        if is_int(tier):
            vehicle['tier'] = tier
        entries = vehicle.setdefault('entries', [])
        previous = entries[-1] if entries else None
        if is_int(entry['marks']):
            before = previous['marks'] if previous and is_int(previous.get('marks')) else None
            reached = vehicle.setdefault('reached', {})
            for mark in range(1, entry['marks'] + 1):
                if before is not None and mark > before and str(mark) not in reached:
                    reached[str(mark)] = entry['t']
        entries.append(entry)
        del entries[:-self.max_entries]
        vehicle['updated'] = entry['t']
        self._forget_oldest()
        return entry

    def _forget_oldest(self):
        while len(self.vehicles) > MAX_VEHICLES:
            oldest = min(self.vehicles, key=lambda key: self.vehicles[key].get('updated') or 0)
            del self.vehicles[oldest]

    def record_battle(self, event, label=None, kind=None):
        moe = event.get('moe') or {}
        vehicle = event.get('vehicle') or {}
        tank_id = vehicle.get('tank_id')
        if not is_int(tank_id) or not is_int(moe.get('damage_rating')) or not moe.get('moving_avg_damage'):
            return None
        arena = event.get('arena_unique_id')
        known = self.vehicle(tank_id)
        if arena and known and any(item.get('arena') == arena for item in known.get('entries') or []):
            return None
        stats = event.get('stats') or {}
        damage = as_int(stats.get('damage_dealt'))
        combined = damage + max(as_int(stats.get('damage_assisted_radio')), as_int(stats.get('damage_assisted_track')),
                                as_int(stats.get('damage_assisted_stun')))
        entry = _entry(event.get('occurred_at') or 0, moe['damage_rating'], moe['moving_avg_damage'], moe.get('marks_on_gun'),
                       SOURCE_BATTLE, arena, damage, combined, event.get('result'))
        return self._record(tank_id, label or vehicle_label(vehicle.get('name')), vehicle.get('tier'), entry, kind)

    def record_snapshot(self, snapshot, now, label=None, kind=None):
        tank_id = snapshot.get('tank_id')
        if not is_int(tank_id) or not is_int(snapshot.get('damage_rating')) or not snapshot.get('moving_avg_damage'):
            return None
        known = self.vehicle(tank_id)
        last = (known.get('entries') or [None])[-1] if known else None
        values = (snapshot['damage_rating'], snapshot['moving_avg_damage'], snapshot.get('marks_on_gun'))
        if last is not None and (last.get('rating'), last.get('avg'), last.get('marks')) == values:
            return None
        entry = _entry(now, values[0], values[1], values[2], SOURCE_HANGAR)
        return self._record(tank_id, label or vehicle_label(snapshot.get('name')), snapshot.get('tier'), entry, kind)

    def clear(self, tank_id):
        return self.vehicles.pop(str(tank_id), None) is not None

    def summary(self, tank_id, trend_battles):
        vehicle = self.vehicle(tank_id)
        entries = (vehicle or {}).get('entries') or []
        if not entries:
            return None
        last = entries[-1]
        battles = [index for index, item in enumerate(entries) if item.get('source') == SOURCE_BATTLE and index > 0]
        last_delta = None
        trend = None
        if battles:
            index = battles[-1]
            last_delta = _delta(entries[index - 1], entries[index])
            window = battles[-trend_battles:]
            trend = _delta(entries[window[0] - 1], entries[window[-1]])
        return {
            'label': vehicle.get('label') or u'',
            'tier': vehicle.get('tier'),
            'percent': percent(last.get('rating')),
            'marks': last.get('marks'),
            'avg': last.get('avg'),
            'last_delta': last_delta,
            'trend': trend,
            'trend_battles': len(battles[-trend_battles:]),
            'reached': dict(vehicle.get('reached') or {}),
            'updated': vehicle.get('updated'),
        }

    def ordered(self):
        return sorted(self.vehicles, key=lambda key: -(self.vehicles[key].get('updated') or 0))


def _delta(before, after):
    first, last = percent(before.get('rating')), percent(after.get('rating'))
    if first is None or last is None:
        return None
    return round(last - first, 2)
