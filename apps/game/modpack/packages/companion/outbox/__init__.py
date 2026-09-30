from __future__ import absolute_import, division, print_function, unicode_literals

import random

from ...core.net.backoff import backoff_delay
from .constants import BASE_BACKOFF_S, JITTER, MAX_BACKOFF_S, MAX_BATCH, MAX_EVENTS, Outcome  # noqa: F401


def classify_status(status):
    if 200 <= status < 300 or status == 409:
        return Outcome.SENT
    if status in (401, 403):
        return Outcome.AUTH
    if status == 413:
        return Outcome.SHRINK
    if status in (400, 404, 422):
        return Outcome.DROP
    return Outcome.RETRY


def _stored_events(data):
    events = data.get('events') if isinstance(data, dict) else None
    if not isinstance(events, list):
        return []
    return [event for event in events if isinstance(event, dict) and event.get('event_id')]


class Outbox(object):

    def __init__(self, storage, max_events=MAX_EVENTS, max_batch=MAX_BATCH, rng=None):
        self.storage = storage
        self.max_events = max_events
        self.max_batch = max_batch
        self.batch_size = max_batch
        self.rng = rng or random.random
        self.attempt = 0
        self.retry_at = 0.0
        self.auth_blocked = False
        self.events = _stored_events(storage.read({}))

    def _persist(self):
        self.storage.write({'events': self.events})

    def __len__(self):
        return len(self.events)

    def enqueue(self, event):
        event_id = event.get('event_id')
        if not event_id:
            return False
        if any(existing.get('event_id') == event_id for existing in self.events):
            return False

        self.events.append(event)
        overflow = len(self.events) - self.max_events
        if overflow > 0:
            self.events = self.events[overflow:]
        self._persist()
        return True

    def ready(self, now):
        return bool(self.events) and not self.auth_blocked and now >= self.retry_at

    def next_batch(self, now):
        if not self.ready(now):
            return None
        return list(self.events[:self.batch_size])

    def _remove(self, batch):
        ids = set(event.get('event_id') for event in batch)
        self.events = [event for event in self.events if event.get('event_id') not in ids]
        self._persist()

    def _backoff(self, now, retry_after=None):
        self.attempt += 1
        delay = backoff_delay(self.attempt, BASE_BACKOFF_S, MAX_BACKOFF_S, JITTER, self.rng, retry_after)
        self.retry_at = now + delay

    def _reset_backoff(self):
        self.attempt = 0
        self.retry_at = 0.0

    def complete(self, batch, status, now, retry_after=None):
        outcome = classify_status(status)
        if outcome == Outcome.SENT:
            self._remove(batch)
            self._reset_backoff()
            self.batch_size = self.max_batch
        elif outcome == Outcome.DROP:
            self._remove(batch)
            self._reset_backoff()
        elif outcome == Outcome.AUTH:
            self.auth_blocked = True
        elif outcome == Outcome.SHRINK:
            self._shrink(batch)
        else:
            self._backoff(now, retry_after)
        return outcome

    def _shrink(self, batch):
        if self.batch_size > 1:
            self.batch_size = self.batch_size // 2
        else:
            self._remove(batch)

    def unblock(self):
        self.auth_blocked = False
        self._reset_backoff()
