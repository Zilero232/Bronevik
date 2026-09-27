from __future__ import absolute_import, division, print_function, unicode_literals


class ReasonError(ValueError):
    """A refusal with a machine-readable `reason` (the i18n key suffix the caller shows)."""

    def __init__(self, reason):
        ValueError.__init__(self, reason)
        self.reason = reason
