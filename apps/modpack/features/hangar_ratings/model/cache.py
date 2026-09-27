from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import OVERVIEW_KEY, REFRESH_AFTER_BATTLE_S, TANK_KEY


def tank_key(tank_id):
    return TANK_KEY % tank_id


class RatingsCache(object):

    def __init__(self, account_id=None):
        self.reset(account_id)

    def reset(self, account_id):
        self.account_id = account_id
        self.overview = None
        self.tanks = {}
        self.fresh = set()
        self.pending = set()
        self.not_before = {}

    def wants(self, key, now):
        return key not in self.fresh and key not in self.pending and now >= self.not_before.get(key, 0.0)

    def start(self, keys):
        self.pending.update(keys)

    def store_overview(self, overview):
        self.pending.discard(OVERVIEW_KEY)
        self.fresh.add(OVERVIEW_KEY)
        self.not_before.pop(OVERVIEW_KEY, None)
        if overview is not None:
            self.overview = overview

    def store_tanks(self, tank_ids, rows):
        for tank_id in tank_ids:
            key = tank_key(tank_id)
            self.pending.discard(key)
            self.fresh.add(key)
            self.not_before.pop(key, None)
            if tank_id in rows:
                self.tanks[tank_id] = rows[tank_id]
            else:
                self.tanks.pop(tank_id, None)

    def fail(self, keys, now, delay):
        for key in keys:
            self.pending.discard(key)
            self.not_before[key] = now + delay

    def after_battle(self, tank_id, now):
        keys = [OVERVIEW_KEY] + ([tank_key(tank_id)] if tank_id else [])
        for key in keys:
            self.fresh.discard(key)
            self.not_before[key] = max(self.not_before.get(key, 0.0), now + REFRESH_AFTER_BATTLE_S)

    def expedite(self, key):
        if key not in self.fresh:
            self.not_before.pop(key, None)

    def refresh_all(self):
        self.fresh.clear()
        self.not_before.clear()

    def tank(self, tank_id):
        return self.tanks.get(tank_id)
