"""The player's own garage: lock state of a vehicle and the client's own item processors (the requests the
hangar's buttons send). `done(success)` of `run_processor` is always called exactly once."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...log import log_exception, safe
from .constants import LOCK_FLAGS


def is_locked(vehicle):
    return any(bool(getattr(vehicle, name, False)) for name in LOCK_FLAGS)


def run_processor(make_processor, done, context):
    """Builds the processor with `make_processor()` and sends its request; a failure is logged as `context`."""
    try:
        processor = make_processor()
    except Exception:
        log_exception('%s processor' % context)
        done(False)
        return

    @safe
    def finished(result):
        done(bool(getattr(result, 'success', False)))

    try:
        processor.request(finished)
    except Exception:
        log_exception('%s request' % context)
        done(False)
