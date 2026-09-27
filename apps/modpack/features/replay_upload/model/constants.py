"""Limits mirror contract/replay-upload.schema.json (#/definitions/limits)."""
from ....core.vendor.enum34 import Enum

UPLOAD_PATH = '/replays/mod'
FILE_FIELD = 'file'
MAX_BYTES = 50 * 1024 * 1024
VISIBILITY_HEADER = 'X-Otmetki-Visibility'
VISIBILITY_PUBLIC = 'public'
VISIBILITY_PRIVATE = 'private'

MATCH_WINDOW_S = 300.0
MAX_CANDIDATES = 30
SETTLE_S = 5.0

MAX_PENDING = 50
MAX_SEEN = 500
FIRST_DELAY_S = 30.0
BUSY_RETRY_S = 15.0
LOCATE_RETRY_S = 60.0
LOCATE_TIMEOUT_S = 30 * 60.0
BASE_BACKOFF_S = 30.0
MAX_BACKOFF_S = 3600.0
QUOTA_BACKOFF_S = 6 * 3600.0
MAX_AGE_S = 7 * 24 * 3600.0
JITTER = 0.2

QUOTA_CODE = 'SUBSCRIPTION_REQUIRED'


class JobResult(Enum):
    """What the worker-thread job found (see upload.upload_job)."""

    HTTP = 'http'
    MISSING = 'missing'
    BUSY = 'busy'
    TOO_LARGE = 'too_large'
    ERROR = 'error'


class Outcome(Enum):
    """What a job result means for the queued battle."""

    DONE = 'done'
    DROP = 'drop'
    AUTH = 'auth'
    QUOTA = 'quota'
    RETRY = 'retry'
    WAIT = 'wait'
