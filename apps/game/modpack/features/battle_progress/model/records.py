from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number
from .constants import ASSIST_STATS, MAX_TANKS, METRICS

# Fair play: the player's own records only: own battle results, the own vehicle dossier and the site's copy of them.


def clean_record(values):
    known = values or {}
    record = {}
    for metric in METRICS:
        value = known.get(metric)
        if is_int(value) and value > 0:
            record[metric] = int(value)
    return record


def _saved(data, key, kind):
    value = data.get(key)
    return value if isinstance(value, kind) else kind()


# The saved order first (least recently seen first), then the tanks the order misses.
def load_order(data, tanks):
    keys = [str(tank_id) for tank_id in _saved(data, 'order', list) if str(tank_id) in tanks]
    keys.extend(sorted(key for key in tanks if key not in keys))
    return keys


def raise_record(current, incoming):
    is_changed = False
    for metric, value in incoming.items():
        if value > current.get(metric, 0):
            current[metric] = value
            is_changed = True
    return is_changed


# The best single-battle values per own tank (random battles), the largest of every source seen. Past MAX_TANKS the tank
# seen least recently is dropped; the order is kept in the file.
class RecordBook(object):

    def __init__(self, data=None):
        self.tanks = {}
        self.order = []

        saved = data if isinstance(data, dict) else {}
        tanks = _saved(saved, 'tanks', dict)
        for key in load_order(saved, tanks):
            if str(key).isdigit() and isinstance(tanks[key], dict):
                self.merge(int(key), tanks[key])

    def get(self, tank_id):
        return dict(self.tanks.get(tank_id) or {})

    def _touch(self, tank_id):
        if tank_id in self.order:
            self.order.remove(tank_id)
        self.order.append(tank_id)

    def _drop_least_recent(self):
        while len(self.order) > MAX_TANKS:
            self.tanks.pop(self.order.pop(0), None)

    def merge(self, tank_id, values):
        if not is_int(tank_id) or tank_id <= 0:
            return False
        incoming = clean_record(values)
        if not incoming:
            return False

        current = self.tanks.setdefault(tank_id, {})
        self._touch(tank_id)
        self._drop_least_recent()
        return raise_record(current, incoming)

    def to_dict(self):
        order = [tank_id for tank_id in self.order if tank_id in self.tanks]
        tanks = dict((str(tank_id), dict(self.tanks[tank_id])) for tank_id in order)
        return {'tanks': tanks, 'order': order}


def event_values(event):
    stats = event.get('stats') or {}

    xp = stats.get('original_xp')
    if not is_number(xp):
        xp = stats.get('xp')
    assist = sum(stats.get(key) for key in ASSIST_STATS if is_number(stats.get(key)))

    return clean_record({'damage': stats.get('damage_dealt'), 'assist': assist, 'frags': stats.get('frags'), 'xp': xp})
