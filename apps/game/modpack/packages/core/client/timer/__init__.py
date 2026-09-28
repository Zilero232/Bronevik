from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ...log import log_exception


def _clock():
    getter = getattr(BigWorld, 'time', None)
    return getter() if getter is not None else None


class Ticker(object):
    """Calls `on_tick()` every `interval_s` through BigWorld.callback from `start()` until `stop()`, or until
    `on_tick` returns False. A failing tick is logged and the ticking goes on; a stop followed by a start
    never leaves two chains running. `elapsed()` inside `on_tick` is the game time since the previous tick (or
    the start or `restart_elapsed()`): a callback fires on the first frame after its delay, so counting
    `interval_s` per tick drifts."""

    def __init__(self, interval_s, on_tick):
        self.interval_s = interval_s
        self.on_tick = on_tick
        self.running = False
        self.generation = 0
        self.last_at = None
        self.last_elapsed = interval_s

    def start(self):
        if self.running:
            return
        self.running = True
        self.generation += 1
        self.last_at = _clock()
        self._schedule(self.generation)

    def stop(self):
        self.running = False

    def elapsed(self):
        return self.last_elapsed

    def restart_elapsed(self):
        """The next `elapsed()` counts from now: call it when a countdown was just set from the client."""
        self.last_at = _clock()

    def _schedule(self, generation):
        BigWorld.callback(self.interval_s, lambda: self._tick(generation))

    def _measure(self):
        now = _clock()
        if now is None or self.last_at is None or now < self.last_at:
            self.last_elapsed = self.interval_s
        else:
            self.last_elapsed = now - self.last_at
        self.last_at = now

    def _tick(self, generation):
        if not self.running or generation != self.generation:
            return
        try:
            self._measure()
            keep = self.on_tick()
        except Exception:
            log_exception('tick')
            keep = True
        if keep is False:
            self.running = False
            return
        self._schedule(generation)
