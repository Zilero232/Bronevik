from __future__ import absolute_import, division, print_function, unicode_literals


class ProfileError(ValueError):

    def __init__(self, reason):
        ValueError.__init__(self, reason)
        self.reason = reason
