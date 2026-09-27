from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ...compat import to_native
from ...log import safe
from ...net.transport import DEFAULT_TIMEOUT_S, NETWORK_ERROR, ThreadTransport, native_headers


class FetchUrlTransport(object):

    def __init__(self, timeout=DEFAULT_TIMEOUT_S):
        self.timeout = timeout

    def request(self, method, url, headers, body, callback):

        @safe
        def on_complete(response):
            status = getattr(response, 'responseCode', NETWORK_ERROR) or NETWORK_ERROR
            data = getattr(response, 'body', b'') or b''
            response_headers = getattr(response, 'headers', None)
            callback(status, data, response_headers if isinstance(response_headers, dict) else {})

        BigWorld.fetchURL(to_native(url), on_complete, headers=native_headers(headers), timeout=self.timeout, method=to_native(method),
                          postData=body or b'')

    def poll(self):
        return 0


def create_transport():
    if hasattr(BigWorld, 'fetchURL'):
        return FetchUrlTransport()
    return ThreadTransport()
