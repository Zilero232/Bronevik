from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import MAX_QUEUE_S


class QueueTimer(object):

    def __init__(self):
        self.queue_type = None
        self.started_at = None
        self.last_wait = None

    def enqueued(self, queue_type, now):
        self.queue_type = queue_type
        self.started_at = now

    def dequeued(self, now):
        if self.started_at is None:
            return None
        wait = now - self.started_at
        finished = (self.queue_type, wait) if 0 <= wait <= MAX_QUEUE_S else None
        self.queue_type = None
        self.started_at = None
        return finished

    def arena_created(self, now):
        finished = self.dequeued(now)
        self.last_wait = round(finished[1], 1) if finished is not None else None
        return finished

    def take_last_wait(self):
        wait = self.last_wait
        self.last_wait = None
        return wait
