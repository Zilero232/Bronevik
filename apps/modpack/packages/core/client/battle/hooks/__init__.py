"""Subscriptions to battle-session events that may not exist yet when the avatar becomes ready."""
from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ....hooks import subscribe, unsubscribe
from ....log import log_exception

RETRY_S = 1.0
ATTEMPTS = 20


class BattleHooks(object):
    """`add(resolve, name, handler)` subscribes `handler` to `resolve().name`, retrying every RETRY_S up
    to ATTEMPTS times while `resolve()` returns None. `clear()` (on battle_leave) removes every
    subscription and cancels the pending retries."""

    def __init__(self, retry_s=RETRY_S, attempts=ATTEMPTS):
        self.retry_s = retry_s
        self.attempts = attempts
        self.items = []
        self.generation = 0

    def add(self, resolve, name, handler):
        self._try(self.generation, resolve, name, handler, 0)

    def _try(self, generation, resolve, name, handler, attempt):
        if generation != self.generation:
            return
        try:
            owner = resolve()
            if owner is not None:
                subscribe(owner, name, handler)
                self.items.append((owner, name, handler))
                return
        except Exception:
            log_exception('hook %s' % name)
            return
        if attempt + 1 < self.attempts:
            BigWorld.callback(self.retry_s, lambda: self._try(generation, resolve, name, handler, attempt + 1))

    def clear(self):
        self.generation += 1
        while self.items:
            owner, name, handler = self.items.pop()
            unsubscribe(owner, name, handler)
