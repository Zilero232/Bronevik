"""Small reads of client state shared by the companion glue and the features (all tolerate a missing API)."""
from __future__ import absolute_import


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
