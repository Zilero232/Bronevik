from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import REFUSE_BERTHS, REFUSE_LOCKED, REFUSE_NOTHING


def plan_demount(vehicle):
    """Slots of the selected vehicle's equipment that come off for free (the client marks such items
    removable). `vehicle`: {locked, devices: [{slot, removable}|None]}. Returns (slots, refusal)."""
    if vehicle.get('locked'):
        return [], REFUSE_LOCKED
    slots = [device['slot'] for device in vehicle.get('devices') or [] if device and device.get('removable')]
    if not slots:
        return [], REFUSE_NOTHING
    return slots, None


def plan_crew_unload(vehicle, free_berths):
    """Whether the whole crew can go to the barracks: the vehicle is idle, has a crew, and the barracks
    have room (`free_berths` None when unknown: the server decides). Returns (count, refusal)."""
    if vehicle.get('locked'):
        return 0, REFUSE_LOCKED
    count = int(vehicle.get('crew') or 0)
    if count <= 0:
        return 0, REFUSE_NOTHING
    if free_berths is not None and free_berths < count:
        return 0, REFUSE_BERTHS
    return count, None
