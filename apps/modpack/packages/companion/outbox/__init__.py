"""The persistent per-account queue of ingest events: batching, retry backoff, auth pause, 413 shrink."""
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
        self.events = []
        self.dropped = 0
        data = storage.read({}) or {}
        events = data.get('events') if isinstance(data, dict) else None
        if isinstance(events, list):
            self.events = [e for e in events if isinstance(e, dict) and e.get('event_id')]

    def _persist(self):
        self.storage.write({'events': self.events})

    def __len__(self):
        return len(self.events)

    def enqueue(self, event):
        event_id = event.get('event_id')
        if not event_id:
            return False
        for existing in self.events:
            if existing.get('event_id') == event_id:
                return False
        self.events.append(event)
        overflow = len(self.events) - self.max_events
        if overflow > 0:
            self.events = self.events[overflow:]
            self.dropped += overflow
        self._persist()
        return True

    def ready(self, now):
        return bool(self.events) and not self.auth_blocked and now >= self.retry_at

    def next_batch(self, now):
        if not self.ready(now):
            return None
        return list(self.events[:self.batch_size])

    def _remove(self, batch):
        ids = set(e.get('event_id') for e in batch)
        self.events = [e for e in self.events if e.get('event_id') not in ids]
        self._persist()

    def _backoff(self, now, retry_after=None):
        self.attempt += 1
        delay = backoff_delay(self.attempt, BASE_BACKOFF_S, MAX_BACKOFF_S, JITTER, self.rng, retry_after)
        self.retry_at = now + delay
        return delay

    def complete(self, batch, status, now, retry_after=None):
        outcome = classify_status(status)
        if outcome == Outcome.SENT:
            self._remove(batch)
            self.attempt = 0
            self.retry_at = 0.0
            self.batch_size = self.max_batch
        elif outcome == Outcome.DROP:
            self._remove(batch)
            self.dropped += len(batch)
            self.attempt = 0
            self.retry_at = 0.0
        elif outcome == Outcome.AUTH:
            self.auth_blocked = True
        elif outcome == Outcome.SHRINK:
            if self.batch_size > 1:
                self.batch_size = max(1, self.batch_size // 2)
            else:
                self._remove(batch)
                self.dropped += len(batch)
        else:
            self._backoff(now, retry_after)
        return outcome

    def unblock(self):
        self.auth_blocked = False
        self.attempt = 0
        self.retry_at = 0.0
