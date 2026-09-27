from ...compat import to_native
from ...vendor import six
from .constants import DEFAULT_TIMEOUT_S, HTTP_WORKER, NETWORK_ERROR
from .runner import BackgroundRunner

_urlrequest = six.moves.urllib.request
HTTPError = six.moves.urllib.error.HTTPError


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

    def __init__(self, timeout=DEFAULT_TIMEOUT_S):
        self.timeout = timeout

    def request(self, method, url, headers, body, callback):
        status, response_body, response_headers = perform(method, url, headers, body, self.timeout)
        callback(status, response_body, response_headers)

    def poll(self):
        return 0


class ThreadTransport(object):
    """Requests on a BackgroundRunner thread; callbacks run on the thread that calls poll() (the game's)."""

    def __init__(self, timeout=DEFAULT_TIMEOUT_S):
        self.timeout = timeout
        self.runner = BackgroundRunner(HTTP_WORKER)

    def request(self, method, url, headers, body, callback):
        timeout = self.timeout

        def job():
            return perform(method, url, headers, body, timeout)

        def done(result):
            if callback is not None:
                callback(*(result or (NETWORK_ERROR, b'', {})))

        self.runner.submit(job, done)

    def poll(self):
        return self.runner.poll()

    def stop(self):
        self.runner.stop()
