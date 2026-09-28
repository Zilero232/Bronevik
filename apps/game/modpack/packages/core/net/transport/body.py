from __future__ import absolute_import, division, print_function, unicode_literals

import io


class TransferStopped(IOError):
    pass


class StoppableBody(object):
    """A request body read in blocks by the HTTP client, so a long upload can be stopped between blocks:
    `should_stop()` turning true makes the next read raise TransferStopped (the exchange then reports a
    network error). Sized, so the transport sends a Content-Length instead of reading it all up front."""

    def __init__(self, data, should_stop):
        self.data = data
        self.should_stop = should_stop
        self.stream = io.BytesIO(data)

    def __len__(self):
        return len(self.data)

    def seek(self, offset, whence=0):
        return self.stream.seek(offset, whence)

    def read(self, size=-1):
        if self.should_stop():
            raise TransferStopped('transfer stopped')
        return self.stream.read(size)
