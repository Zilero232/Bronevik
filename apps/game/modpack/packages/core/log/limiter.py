from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import MAX_TRACKED_ERRORS, REPEAT_WINDOW_S


class RepeatLimiter(object):
    """Lets the first of identical messages through per window of `window_s` seconds and counts the rest;
    the first message of the next window carries the count of the ones held back."""

    def __init__(self, clock, window_s=REPEAT_WINDOW_S, max_tracked=MAX_TRACKED_ERRORS):
        self.clock = clock
        self.window_s = window_s
        self.max_tracked = max_tracked
        self.seen = {}

    def admit(self, key):
        """(write, suppressed): whether to write this one, and how many identical ones were held back since."""
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
