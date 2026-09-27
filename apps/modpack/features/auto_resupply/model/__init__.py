from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import tri_state
from ..settings.constants import FLAGS
from .constants import ACTION_ALL, ACTION_SELECTED, REFUSE_LOCKED, REFUSE_NOTHING, REFUSE_UNSET  # noqa: F401

# Left out: an automatic crew return. RU 1.45 has no such vehicle flag; the crew's return is a one-off request
# (the hangar tweaks' quick action).


def wanted(values):
    result = {}
    for flag in FLAGS:
        value = tri_state(values.get(flag))
        if value is not None:
            result[flag] = value
    return result


def plan_vehicle(vehicle, desired):
    if vehicle.get('locked'):
        return []
    current = vehicle.get('flags') or {}
    return [(flag, desired[flag]) for flag in FLAGS if flag in desired and current.get(flag) is not None and current[flag] != desired[flag]]


def plan(vehicles, values):
    desired = wanted(values)
    if not desired:
        return [], REFUSE_UNSET
    if vehicles and all(vehicle.get('locked') for vehicle in vehicles):
        return [], REFUSE_LOCKED
    requests = [(vehicle['inv_id'], flag, value) for vehicle in vehicles for flag, value in plan_vehicle(vehicle, desired)]
    if not requests:
        return [], REFUSE_NOTHING
    return requests, None
