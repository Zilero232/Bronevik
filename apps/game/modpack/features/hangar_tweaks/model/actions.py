from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import REFUSE_BERTHS, REFUSE_LOCKED, REFUSE_NOTHING


def plan_demount(vehicle):
    if vehicle.get('locked'):
        return [], REFUSE_LOCKED
    slots = [device['slot'] for device in vehicle.get('devices') or [] if device and device.get('removable')]
    if not slots:
        return [], REFUSE_NOTHING
    return slots, None


def plan_crew_unload(vehicle, free_berths):
    if vehicle.get('locked'):
        return 0, REFUSE_LOCKED
    count = int(vehicle.get('crew') or 0)
    if count <= 0:
        return 0, REFUSE_NOTHING
    if free_berths is not None and free_berths < count:
        return 0, REFUSE_BERTHS
    return count, None


def plan_crew_return(vehicle):
    if vehicle.get('locked'):
        return REFUSE_LOCKED
    if not vehicle.get('last_crew'):
        return REFUSE_NOTHING
    return None
