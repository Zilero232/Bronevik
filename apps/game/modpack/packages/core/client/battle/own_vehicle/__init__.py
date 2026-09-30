"""Hooks on the hit effects the client draws on the player's own vehicle.

Fair play: the calls on every other vehicle are passed through untouched and never reach a callback, so a feature
sees only the shots and splashes that land on the player's own tank, as the client draws them."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....hooks import override
from ....log import log_exception
from ...game import client_attr
from .constants import EXPLOSION_METHOD, OWN_VEHICLE_ATTR, SHOT_METHOD, VEHICLE_CLASS, VEHICLE_MODULE

__all__ = ('EXPLOSION_METHOD', 'SHOT_METHOD', 'on_own_shot', 'on_own_vehicle_effect')


def on_own_vehicle_effect(method, callback):
    """After the client runs `Vehicle.<method>(attacker_id, *args)` on the player's own vehicle, calls
    `callback(attacker_id, *args)`. Returns False when nothing was hooked (no such client method, or the hook
    failed)."""
    vehicle = client_attr(VEHICLE_MODULE, VEHICLE_CLASS)
    if vehicle is None or not hasattr(vehicle, method):
        return False

    def hook(original, entity, attacker_id, *args, **kwargs):
        result = original(entity, attacker_id, *args, **kwargs)
        if getattr(entity, OWN_VEHICLE_ATTR, False):
            callback(attacker_id, *args)
        return result

    try:
        override(vehicle, method)(hook)
    except Exception:
        log_exception('own vehicle: %s' % method)
        return False
    return True


def on_own_shot(callback):
    """`callback(attacker_id, points)` for every shot the client draws on the player's own vehicle; `points` are the
    shot's packed segments (`core.shot_points.drawn_points` decodes them). Returns False when nothing was hooked."""
    def shot(attacker_id, points, *details):
        callback(attacker_id, points)

    return on_own_vehicle_effect(SHOT_METHOD, shot)
