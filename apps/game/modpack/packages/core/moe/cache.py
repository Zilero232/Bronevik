from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import THRESHOLD_ERROR_TTL_S, THRESHOLD_TTL_S


class ThresholdCache(object):

    def __init__(self):
        self.entries = {}
        self.pending = set()

    def get(self, tank_id):
        entry = self.entries.get(tank_id)
        return entry[1] if entry is not None else None

    def due(self, tank_id, now):
        if tank_id in self.pending:
            return False
        entry = self.entries.get(tank_id)
        if entry is None:
            return True
        ttl = THRESHOLD_TTL_S if entry[1] is not None else THRESHOLD_ERROR_TTL_S
        return now - entry[0] >= ttl

    def begin(self, tank_id):
        self.pending.add(tank_id)

    def store(self, tank_id, curve, now):
        self.pending.discard(tank_id)
        previous = self.get(tank_id)
        if curve is None and previous is not None:
            self.entries[tank_id] = (now - THRESHOLD_TTL_S + THRESHOLD_ERROR_TTL_S, previous)
        else:
            self.entries[tank_id] = (now, curve)
