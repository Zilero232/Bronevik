from __future__ import absolute_import, division, print_function, unicode_literals


class ReplayActionError(ValueError):

    def __init__(self, reason):
        ValueError.__init__(self, reason)
        self.reason = reason
