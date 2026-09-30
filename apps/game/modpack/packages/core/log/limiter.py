from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import MAX_TRACKED_ERRORS, REPEAT_WINDOW_S


class RepeatLimiter(object):

    def __init__(self, clock, window_s=REPEAT_WINDOW_S, max_tracked=MAX_TRACKED_ERRORS):
        self.clock = clock
        self.window_s = window_s
        self.max_tracked = max_tracked
        self.seen = {}

    def admit(self, key):
        now = self.clock()
        entry = self.seen.get(key)
        if entry is not None and now - entry[0] < self.window_s:
            entry[1] += 1
            return False, 0
        suppressed = entry[1] if entry is not None else 0
        if entry is None and len(self.seen) >= self.max_tracked:
            oldest = min(self.seen, key=lambda name: self.seen[name][0])
            del self.seen[oldest]
        self.seen[key] = [now, 0]
        return True, suppressed
