from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.game import vehicle_type
from ....core.compat import to_native
from ..model import vehicle_parts


def _type_of(tank_id, vehicle):
    found = vehicle_type(tank_id) if tank_id else None
    if found is not None:
        return found
    nation, name = vehicle_parts(vehicle)
    if nation is None:
        return None
    try:
        import items
        from items import vehicles
        nation_id, type_id = vehicles.g_list.getIDsByName(to_native('%s:%s' % (nation, name)))
        return vehicle_type(items.makeIntCompactDescrByID('vehicle', nation_id, type_id))
    except Exception:
        return None


class VehicleNames(object):
    """The client's localized short name, tier and class of a replay's vehicle, looked up once per vehicle."""

    def __init__(self):
        self.known = {}

    def __call__(self, tank_id, vehicle):
        key = vehicle or tank_id
        if key not in self.known:
            found = _type_of(tank_id, vehicle)
            self.known[key] = {
                'label': getattr(found, 'shortUserString', None),
                'tier': getattr(found, 'level', None),
                'cls': getattr(found, 'classTag', None),
            } if found is not None else {}
        return self.known[key]
