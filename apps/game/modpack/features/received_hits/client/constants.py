from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 common/BattleFeedbackCommon.BATTLE_EVENT_TYPE: the player's own feedback about hits on the own tank.
KIND_BY_EVENT = (
    ('RECEIVED_DAMAGE', 'pen'),
    ('TANKING', 'blocked'),
    ('RECEIVED_CRIT', 'crit'),
)
# RU 1.45 client source (Vehicle.py): Vehicle.showDamageFromShot(attackerID, points, effectsIndex, damageFactor,
# lastMaterialIsShield) draws a shot's effects on a vehicle; only the calls on the own vehicle (isPlayerVehicle) are read.
VEHICLE_MODULE = 'Vehicle'
VEHICLE_CLASS = 'Vehicle'
SHOT_METHOD = 'showDamageFromShot'
OWN_VEHICLE_ATTR = 'isPlayerVehicle'
