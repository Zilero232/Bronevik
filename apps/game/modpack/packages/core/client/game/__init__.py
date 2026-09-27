"""Small reads of client state shared by the companion glue and the features (all tolerate a missing API)."""
from __future__ import absolute_import, division, print_function, unicode_literals

import importlib  # novermin


def client_version():
    try:
        from helpers import getFullClientVersion
        return getFullClientVersion()
    except Exception:
        return ''


def client_language():
    try:
        from helpers import getClientLanguage
        return getClientLanguage()
    except Exception:
        return None


def client_attr(module_name, name):
    """`module_name.name` of the client, or None when the module or the name is missing."""
    try:
        return getattr(importlib.import_module(module_name), name, None)
    except Exception:
        return None


def service(skeleton):
    """The client's instance of a `skeletons.*` interface (helpers.dependency), or None."""
    if skeleton is None:
        return None
    try:
        from helpers import dependency
        return dependency.instance(skeleton)
    except Exception:
        return None


def values_by_name(holder, pairs):
    """{holder.<name>: value} for the (name, value) pairs whose name the client's enum class has."""
    table = {}
    for name, value in pairs:
        key = getattr(holder, name, None)
        if key is not None:
            table[key] = value
    return table


def selected_vehicle():
    """The vehicle selected in the hangar (CurrentVehicle.g_currentVehicle.item), or None."""
    try:
        from CurrentVehicle import g_currentVehicle
    except ImportError:
        return None
    return getattr(g_currentVehicle, 'item', None)


def player_tank_id(player):
    descriptor = getattr(player, 'vehicleTypeDescriptor', None)
    vehicle_type = getattr(descriptor, 'type', None)
    return getattr(vehicle_type, 'compactDescr', None)


def vehicle_info(tank_id):
    try:
        from items import vehicles
        vehicle_type = vehicles.getVehicleType(tank_id)
        return vehicle_type.name, vehicle_type.level
    except Exception:
        return None, None


def map_name(arena_type_id):
    try:
        import ArenaType
        return getattr(ArenaType.g_cache.get(arena_type_id), 'geometryName', None)
    except Exception:
        return None


def vehicle_short_name(tank_id):
    """The localized short vehicle name the carousel shows, or None."""
    try:
        from items import vehicles
        return vehicles.getVehicleType(tank_id).shortUserString
    except Exception:
        return None


def map_label(arena_type_id):
    """The localized map name, or None."""
    try:
        import ArenaType
        return getattr(ArenaType.g_cache.get(arena_type_id), 'name', None)
    except Exception:
        return None
