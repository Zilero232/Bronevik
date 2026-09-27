from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.vendor.enum34 import Enum

MAX_EVENTS = 2000
MAX_BATCH = 50
BASE_BACKOFF_S = 5.0
MAX_BACKOFF_S = 600.0
JITTER = 0.2


class Outcome(Enum):

    SENT = 'sent'
    RETRY = 'retry'
    DROP = 'drop'
    AUTH = 'auth'
    SHRINK = 'shrink'
