from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source (Vehicle.py): the hit effects the client plays on a vehicle; we read them on the own one only.
VEHICLE_MODULE = 'Vehicle'
VEHICLE_CLASS = 'Vehicle'
SHOT_METHOD = 'showDamageFromShot'
SPLASH_METHOD = 'showDamageFromExplosion'
OWN_VEHICLE_ATTR = 'isPlayerVehicle'
KIND_BY_EVENT = (
    ('RECEIVED_DAMAGE', 'received'),
    ('RECEIVED_CRIT', 'crits'),
)
