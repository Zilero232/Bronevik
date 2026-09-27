"""Reads of the player's own selected vehicle for the quick actions. Attribute names follow the WoT-era
gui_items (Vehicle.optDevices.installed, OptionalDevice.isRemovable, Vehicle.crew) and are UNVERIFIED on
Lesta 1.45; anything missing reads as "nothing to do"."""
from __future__ import absolute_import, division, print_function, unicode_literals


def selected_vehicle():
    try:
        from CurrentVehicle import g_currentVehicle
    except ImportError:
        return None
    return getattr(g_currentVehicle, 'item', None)


def is_locked(vehicle):
    for name in ('isInBattle', 'isInPrebattle', 'isLocked', 'isInUnit'):
        if getattr(vehicle, name, False):
            return True
    return False


def summary(vehicle):
    """{locked, devices: [{slot, removable}|None], crew: count} of the selected vehicle."""
    devices = []
    installed = getattr(getattr(vehicle, 'optDevices', None), 'installed', None) or []
    for slot, device in enumerate(installed):
        devices.append({'slot': slot, 'removable': bool(getattr(device, 'isRemovable', False))} if device is not None else None)
    crew = [member for _, member in (getattr(vehicle, 'crew', None) or []) if member is not None]
    return {'locked': is_locked(vehicle), 'devices': devices, 'crew': len(crew)}


def device_in(vehicle, slot):
    installed = getattr(getattr(vehicle, 'optDevices', None), 'installed', None) or []
    return installed[slot] if 0 <= slot < len(installed) else None


def free_berths():
    try:
        from helpers import dependency
        from skeletons.gui.shared import IItemsCache
        stats = dependency.instance(IItemsCache).items.stats
        return int(stats.tankmenBerthsCount) - int(stats.tankmenCount)
    except Exception:
        return None
