from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.log import log_exception

# RU 1.45 client source (gui/shared/gui_items/Vehicle.py, artefacts.py): Vehicle.optDevices.installed and .slots
# (OptDeviceSlotData.categories), OptionalDevice.descriptor.categories (a device in a slot of its own category gets
# the slot's bonus, the green frame of the hangar), Vehicle.battleBoosters.installed, the items' userName and icon;
# VehicleDescriptor.modifications with vehicles.g_cache.postProgression().modifications (the field modifications, as
# the companion's loadout reads them). UNVERIFIED on Lesta 1.45: `locName` of a modification.


def _installed(layout):
    try:
        return list(getattr(layout, 'installed', None) or [])
    except Exception:
        return []


def _categories(value):
    try:
        return set(value or ())
    except TypeError:
        return set()


def _devices(vehicle):
    layout = getattr(vehicle, 'optDevices', None)
    slots = list(getattr(layout, 'slots', None) or [])
    devices = []
    for index, item in enumerate(_installed(layout)):
        if item is None:
            continue
        slot = slots[index] if index < len(slots) else None
        bonus = bool(_categories(getattr(slot, 'categories', None)) & _categories(getattr(getattr(item, 'descriptor', None), 'categories', None)))
        devices.append({'name': getattr(item, 'userName', None), 'icon': getattr(item, 'icon', None), 'bonus': bonus})
    return devices


def _directives(vehicle):
    return [{'name': getattr(item, 'userName', None), 'icon': getattr(item, 'icon', None)}
            for item in _installed(getattr(vehicle, 'battleBoosters', None)) if item is not None]


def _modifications(vehicle):
    ids = getattr(getattr(vehicle, 'descriptor', None), 'modifications', None) or ()
    if not ids:
        return []
    try:
        from items import vehicles
        table = vehicles.g_cache.postProgression().modifications
    except Exception:
        return []
    names = []
    for modification_id in ids:
        modification = table.get(modification_id) if hasattr(table, 'get') else None
        name = getattr(modification, 'locName', None) or getattr(modification, 'name', None)
        if name:
            names.append(name)
    return names


def selected_loadout():
    """(tank_id, loadout) of the vehicle selected in the hangar, or (None, None)."""
    try:
        from CurrentVehicle import g_currentVehicle
        vehicle = getattr(g_currentVehicle, 'item', None)
        if vehicle is None:
            return None, None
        return getattr(vehicle, 'intCD', None), {
            'devices': _devices(vehicle),
            'modifications': _modifications(vehicle),
            'directives': _directives(vehicle),
        }
    except Exception:
        log_exception('battle loadout: read')
        return None, None
