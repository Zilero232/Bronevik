"""Reads of the battle session that the player's own GUI already uses: the battle feedback, the state of
the controlled vehicle, the arena data provider behind the player panels. Nothing here reads
positions, aim, reloads or spotting."""
from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld


def player():
    return BigWorld.player()


def session_provider():
    return getattr(player(), 'guiSessionProvider', None)


def shared(name):
    return getattr(getattr(session_provider(), 'shared', None), name, None)


def feedback():
    return shared('feedback')


def vehicle_state():
    return shared('vehicleState')


def arena_dp():
    getter = getattr(session_provider(), 'getArenaDP', None)
    return getter() if getter is not None else None


def arena():
    return getattr(player(), 'arena', None)


def server_time():
    getter = getattr(BigWorld, 'serverTime', None)
    return getter() if getter is not None else None


def controls_own_vehicle():
    """True while the camera follows the player's own vehicle (not a teammate after death)."""
    state = vehicle_state()
    if state is None:
        return False
    return state.getControllingVehicleID() == getattr(player(), 'playerVehicleID', None)


def vehicle_info(vehicle_id):
    provider = arena_dp()
    if provider is None or not vehicle_id:
        return None
    return provider.getVehicleInfo(vehicle_id)


def vehicle_name(vehicle_id):
    """The short vehicle name the player panels and the vanilla damage log show."""
    vehicle_type = getattr(vehicle_info(vehicle_id), 'vehicleType', None)
    return getattr(vehicle_type, 'shortName', None) or getattr(vehicle_type, 'name', None)


def vehicle_class(vehicle_id):
    """The class tag (lightTank, mediumTank, heavyTank, AT-SPG, SPG) the player panels and the vanilla damage log show."""
    return getattr(getattr(vehicle_info(vehicle_id), 'vehicleType', None), 'classTag', None)


def is_enemy(vehicle_id):
    provider = arena_dp()
    info = vehicle_info(vehicle_id)
    return info is not None and provider is not None and bool(provider.isEnemyTeam(info.team))


def call(target, name, default=None, *args):
    """`target.name(*args)`, or `default` when the method is missing or raises (client API drift)."""
    method = getattr(target, name, None)
    if method is None:
        return default
    try:
        return method(*args)
    except Exception:
        return default
