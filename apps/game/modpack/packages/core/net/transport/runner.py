from __future__ import absolute_import, division, print_function, unicode_literals

import threading

from ...vendor import six
from .constants import DEFAULT_WORKER

_queue = six.moves.queue


class BackgroundRunner(object):
    """Runs jobs on one daemon thread; their results are handed back on the thread that calls poll().

    Jobs must never touch BigWorld: only the callback, run from poll() on the main thread, may.
    """

    def __init__(self, name=DEFAULT_WORKER):
        self.name = name
        self._jobs = _queue.Queue()
        self._results = _queue.Queue()
        self._thread = None
        self._lock = threading.Lock()

    def _ensure_thread(self):
        with self._lock:
            if self._thread is not None and self._thread.is_alive():
                return
            self._thread = threading.Thread(target=self._worker, name=self.name)
            self._thread.daemon = True
            self._thread.start()

    def submit(self, job, callback):
        self._ensure_thread()
        self._jobs.put((job, callback))

    def _worker(self):
        while True:
            item = self._jobs.get()
            if item is None:
                return
            job, callback = item
            try:
                result = job()
            except Exception:
                result = None
            self._results.put((callback, result))

    def poll(self):
        handled = 0
        while True:
            try:
                callback, result = self._results.get_nowait()
            except _queue.Empty:
                return handled
            handled += 1
            if callback is not None:
                callback(result)

    def stop(self):
        self._jobs.put(None)
