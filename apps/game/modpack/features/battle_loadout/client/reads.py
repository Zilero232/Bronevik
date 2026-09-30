from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.log import log_exception

# RU 1.45 client source (gui/shared/gui_items/Vehicle.py, artefacts.py): Vehicle.optDevices.installed and .slots
# (OptDeviceSlotData.categories), OptionalDevice.descriptor.categories (a device in a slot of its own category gets
# the slot's bonus, the green frame of the hangar), Vehicle.battleBoosters.installed, the items' userName and icon;
# VehicleDescriptor.modifications with vehicles.g_cache.postProgression().modifications (the field modifications, as
# the companion's loadout reads them). A modification's `locName` is a resource key: its text is
# backport.text(R.strings.artefacts.dyn(locName).name()), as gui/veh_post_progression/models/modifications.py
# PostProgressionActionItem.getLocNameRes() and the post-progression dialogs read it.


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


def _slot(layout, slots, index):
    # RU 1.45 client source (gui/shared/gui_items/vehicle_equipment.py _OptDevicesCollector.getSlot): the slot with the
    # player's chosen specialization (dynSlotTypeIdx) takes the chosen category, not the one in `slots`.
    get_slot = getattr(layout, 'getSlot', None)
    if get_slot is not None and index < len(slots):
        try:
            return getattr(get_slot(index), 'item', None)
        except Exception:
            log_exception('battle loadout: device slot')
    return slots[index] if index < len(slots) else None


def _devices(vehicle):
    layout = getattr(vehicle, 'optDevices', None)
    slots = list(getattr(layout, 'slots', None) or [])
    devices = []
    for index, item in enumerate(_installed(layout)):
        if item is None:
            continue
        slot = _slot(layout, slots, index)
        bonus = bool(_categories(getattr(slot, 'categories', None)) & _categories(getattr(getattr(item, 'descriptor', None), 'categories', None)))
        devices.append({'name': getattr(item, 'userName', None), 'icon': getattr(item, 'icon', None), 'bonus': bonus})
    return devices


def _directives(vehicle):
    return [{'name': getattr(item, 'userName', None), 'icon': getattr(item, 'icon', None)}
            for item in _installed(getattr(vehicle, 'battleBoosters', None)) if item is not None]


def _modification_text(backport, strings, loc_name):
    if not loc_name:
        return None
    resource = strings.artefacts.dyn(loc_name).dyn('name')
    return backport.text(resource()) if resource.exists() else None


def _modifications(vehicle):
    ids = getattr(getattr(vehicle, 'descriptor', None), 'modifications', None) or ()
    if not ids:
        return []
    try:
        from gui.impl import backport
        from gui.impl.gen import R
        from items import vehicles
        table = vehicles.g_cache.postProgression().modifications
    except Exception:
        return []
    names = []
    for modification_id in ids:
        modification = table.get(modification_id) if hasattr(table, 'get') else None
        name = _modification_text(backport, R.strings, getattr(modification, 'locName', None))
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
