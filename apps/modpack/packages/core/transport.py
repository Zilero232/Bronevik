import threading

from .compat import to_native

try:
    import urllib2 as _urlrequest  # novermin
    from urllib2 import HTTPError  # novermin
except ImportError:
    import urllib.request as _urlrequest  # novermin
    from urllib.error import HTTPError  # novermin

try:
    import Queue as _queue  # novermin
except ImportError:
    import queue as _queue  # novermin

NETWORK_ERROR = 0


def _headers_of(response):
    try:
        return dict((k, v) for k, v in response.info().items())
    except Exception:
        return {}


def perform(method, url, headers, body, timeout):
    """One blocking HTTP exchange: (status, body, headers); status NETWORK_ERROR when nothing came back."""
    native = dict((to_native(key), to_native(value)) for key, value in (headers or {}).items())
    request = _urlrequest.Request(to_native(url), data=body, headers=native)
    request.get_method = lambda: method
    try:
        response = _urlrequest.urlopen(request, timeout=timeout)
        try:
            return response.getcode(), response.read(), _headers_of(response)
        finally:
            response.close()
    except HTTPError as error:
        try:
            data = error.read()
        except Exception:
            data = b''
        return error.code, data, _headers_of(error)
    except Exception:
        return NETWORK_ERROR, b'', {}


class SyncTransport(object):
    """Blocking transport for code that already runs on a worker thread (BackgroundRunner jobs)."""

    def __init__(self, timeout=15.0):
        self.timeout = timeout

    def request(self, method, url, headers, body, callback):
        status, response_body, response_headers = perform(method, url, headers, body, self.timeout)
        callback(status, response_body, response_headers)

    def poll(self):
        return 0


class BackgroundRunner(object):
    """Runs jobs on one daemon thread; their results are handed back on the thread that calls poll().

    Jobs must never touch BigWorld: only the callback, run from poll() on the main thread, may.
    """

    def __init__(self, name='otmetki-worker'):
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


class ThreadTransport(object):

    def __init__(self, timeout=15.0):
        self.timeout = timeout
        self._jobs = _queue.Queue()
        self._results = _queue.Queue()
        self._thread = None
        self._lock = threading.Lock()

    def _ensure_thread(self):
        with self._lock:
            if self._thread is not None and self._thread.is_alive():
                return
            self._thread = threading.Thread(target=self._worker, name='otmetki-http')
            self._thread.daemon = True
            self._thread.start()

    def request(self, method, url, headers, body, callback):
        self._ensure_thread()
        self._jobs.put((method, url, headers, body, callback))

    def _worker(self):
        while True:
            job = self._jobs.get()
            if job is None:
                return
            method, url, headers, body, callback = job
            status, response_body, response_headers = self._perform(method, url, headers, body)
            self._results.put((callback, status, response_body, response_headers))

    def _perform(self, method, url, headers, body):
        return perform(method, url, headers, body, self.timeout)

    def poll(self):
        handled = 0
        while True:
            try:
                callback, status, body, headers = self._results.get_nowait()
            except _queue.Empty:
                return handled
            handled += 1
            if callback is not None:
                callback(status, body, headers)

    def stop(self):
        self._jobs.put(None)
