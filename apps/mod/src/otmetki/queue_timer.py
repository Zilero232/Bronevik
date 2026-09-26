MAX_QUEUE_S = 30 * 60


class QueueTimer(object):

    def __init__(self):
        self.queue_type = None
        self.started_at = None
        self.last_wait = None

    def enqueued(self, queue_type, now):
        self.queue_type = queue_type
        self.started_at = now

    def _finish(self, now):
        if self.started_at is None:
            return None
        wait = now - self.started_at
        result = (self.queue_type, wait) if 0 <= wait <= MAX_QUEUE_S else None
        self.queue_type = None
        self.started_at = None
        return result

    def dequeued(self, now):
        return self._finish(now)

    def arena_created(self, now):
        result = self._finish(now)
        self.last_wait = round(result[1], 1) if result is not None else None
        return result

    def take_last_wait(self):
        wait = self.last_wait
        self.last_wait = None
        return wait
