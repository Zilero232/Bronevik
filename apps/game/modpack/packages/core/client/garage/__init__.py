"""The player's own garage: lock state of a vehicle and the client's own item processors (the requests the
hangar's buttons send). `done(success)` of `run_processor` is always called exactly once."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...log import log_exception, safe
from ..game import service
from .constants import LOCK_FLAGS


def is_locked(vehicle):
    return any(bool(getattr(vehicle, name, False)) for name in LOCK_FLAGS)


def _push_messages(result):
    # RU 1.45 client source: the hangar's own buttons show a processor's result through
    # gui.SystemMessages.pushMessagesFromResult (per-item success or error text).
    try:
        from gui import SystemMessages
        push = getattr(SystemMessages, 'pushMessagesFromResult', None)
    except ImportError:
        return
    if push is not None and result is not None:
        push(result)


def run_processor(make_processor, done, context):
    """Builds the processor with `make_processor()` and sends its request; a failure is logged as `context`.
    The client's own result text is shown the way the hangar's buttons show it."""
    try:
        processor = make_processor()
    except Exception:
        log_exception('%s processor' % context)
        done(False)
        return

    @safe
    def finished(result):
        try:
            _push_messages(result)
        finally:
            done(bool(getattr(result, 'success', False)))

    try:
        processor.request(finished)
    except Exception:
        log_exception('%s request' % context)
        done(False)


def run_in_order(steps, done, context):
    """Sends processors one after another, each built only when the one before it has answered (the
    client's inventory requests must not overlap). `steps` are `make_processor` callables; one that returns
    None is skipped. Stops at the first failure; `done(success)` is called exactly once."""
    remaining = list(steps)

    def next_step(success=True):
        if not success:
            done(False)
            return
        while remaining:
            make_processor = remaining.pop(0)
            try:
                processor = make_processor()
            except Exception:
                log_exception('%s processor' % context)
                done(False)
                return
            if processor is not None:
                run_processor(lambda: processor, next_step, context)
                return
        done(True)

    next_step()


def fresh_vehicle(vehicle):
    """The current state of `vehicle` from the items cache (IItemsCache.items.getVehicle(invID), RU 1.45
    client source), or `vehicle` itself when it cannot be read again."""
    try:
        from skeletons.gui.shared import IItemsCache
        items = service(IItemsCache).items
        return items.getVehicle(vehicle.invID) or vehicle
    except Exception:
        return vehicle
