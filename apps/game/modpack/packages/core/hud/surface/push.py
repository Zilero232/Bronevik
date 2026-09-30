from __future__ import absolute_import, division, print_function, unicode_literals


class FramePush(object):
    """A page's state pushed at most once a frame, and only when it changed: the first change of a frame asks
    `schedule(flush)` for the next one, later changes of that frame only wait for it. The flush encodes the state as it
    is then (`encode()`, None while there is no page) and hands it to `send(text)` unless it is the text sent last."""

    def __init__(self, schedule, encode, send):
        self.schedule = schedule
        self.encode = encode
        self.send = send
        self.pending = False
        self.sent = None

    def request(self):
        if not self.pending:
            self.pending = True
            self.schedule(self.flush)

    def flush(self):
        self.pending = False
        text = self.encode()
        if text is None or text == self.sent:
            return False
        self.sent = text
        self.send(text)
        return True

    def forget(self):
        """A new page: the next flush sends the state even when it did not change."""
        self.sent = None
