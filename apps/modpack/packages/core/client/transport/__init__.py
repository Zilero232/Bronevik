from __future__ import absolute_import

import BigWorld

from ...log import safe
from ...net.transport import NETWORK_ERROR, ThreadTransport


class FetchUrlTransport(object):

    def __init__(self, timeout=15.0):
        self.timeout = timeout

    def request(self, method, url, headers, body, callback):

        @safe
        def on_complete(response):
            status = getattr(response, 'responseCode', NETWORK_ERROR) or NETWORK_ERROR
            data = getattr(response, 'body', '') or ''
            response_headers = getattr(response, 'headers', None)
            callback(status, data, response_headers if isinstance(response_headers, dict) else {})

        BigWorld.fetchURL(url, on_complete, headers=dict(headers or {}), timeout=self.timeout, method=method, postData=body or '')

    def poll(self):
        return 0


def create_transport():
    if hasattr(BigWorld, 'fetchURL'):
        return FetchUrlTransport()
    return ThreadTransport()
