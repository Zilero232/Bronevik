from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.game import service
from ....core.client.garage import is_locked

# WoT-era gui_items names (Vehicle.optDevices.installed, OptionalDevice.isRemovable, Vehicle.crew), UNVERIFIED
# on Lesta 1.45: anything missing reads as "nothing to do".


def _installed(vehicle):
    return getattr(getattr(vehicle, 'optDevices', None), 'installed', None) or []


def summary(vehicle):
    devices = []
    for slot, device in enumerate(_installed(vehicle)):
        devices.append({'slot': slot, 'removable': bool(getattr(device, 'isRemovable', False))} if device is not None else None)
    crew = [member for _, member in (getattr(vehicle, 'crew', None) or []) if member is not None]
    return {'locked': is_locked(vehicle), 'devices': devices, 'crew': len(crew), 'last_crew': bool(getattr(vehicle, 'lastCrew', None))}


def device_in(vehicle, slot):
    installed = _installed(vehicle)
    return installed[slot] if 0 <= slot < len(installed) else None


def free_berths():
    try:
        from skeletons.gui.shared import IItemsCache
        stats = service(IItemsCache).items.stats
        return int(stats.tankmenBerthsCount) - int(stats.tankmenCount)
    except Exception:
        return None
