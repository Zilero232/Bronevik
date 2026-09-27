from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ...log import log_exception


class Ticker(object):
    """Calls `on_tick()` every `interval_s` through BigWorld.callback from `start()` until `stop()`, or until
    `on_tick` returns False. A failing tick is logged and the ticking goes on; a stop followed by a start
    never leaves two chains running."""

    def __init__(self, interval_s, on_tick):
        self.interval_s = interval_s
        self.on_tick = on_tick
        self.running = False
        self.generation = 0

    def start(self):
        if self.running:
            return
        self.running = True
        self.generation += 1
        self._schedule(self.generation)

    def stop(self):
        self.running = False

    def _schedule(self, generation):
        BigWorld.callback(self.interval_s, lambda: self._tick(generation))

    def _tick(self, generation):
        if not self.running or generation != self.generation:
            return
        try:
            keep = self.on_tick()
        except Exception:
            log_exception('tick')
            keep = True
        if keep is False:
            self.running = False
            return
        self._schedule(generation)
