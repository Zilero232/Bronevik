from __future__ import absolute_import, division, print_function, unicode_literals


class ReadState(object):
    """Which keyed reads are due: a key is read once, not twice at once, and again only after `stale()` or a
    failure's delay. The data itself stays with the caller."""

    def __init__(self):
        self.reset()

    def reset(self):
        self.fresh = set()
        self.pending = set()
        self.not_before = {}

    def wants(self, key, now):
        return key not in self.fresh and key not in self.pending and now >= self.not_before.get(key, 0.0)

    def start(self, keys):
        self.pending.update(keys)

    def done(self, keys):
        for key in keys:
            self.pending.discard(key)
            self.fresh.add(key)
            self.not_before.pop(key, None)

    def fail(self, keys, now, delay):
        for key in keys:
            self.pending.discard(key)
            self.not_before[key] = now + delay

    def stale(self, keys, now, delay):
        """Read `keys` again, not before `now + delay` (the site counts a battle after the ingest flush)."""
        for key in keys:
            self.fresh.discard(key)
            self.not_before[key] = max(self.not_before.get(key, 0.0), now + delay)

    def expedite(self, key):
        if key not in self.fresh:
            self.not_before.pop(key, None)

    def refresh_all(self):
        self.fresh.clear()
        self.not_before.clear()
