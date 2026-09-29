from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source (Vehicle.py): Vehicle.showDamageFromShot(attackerID, points, effectsIndex, damageFactor,
# lastMaterialIsShield) is how the client draws the effects of a shot on a vehicle; the feature keeps only the calls on
# the player's own vehicle (isPlayerVehicle). Drawing the points on the hangar's 3D model needs its collision boxes and
# could not be checked without the client, so the hangar shows a schematic instead.
VEHICLE_MODULE = 'Vehicle'
VEHICLE_CLASS = 'Vehicle'
SHOT_METHOD = 'showDamageFromShot'
OWN_VEHICLE_ATTR = 'isPlayerVehicle'
# RU 1.45 common/BattleFeedbackCommon.BATTLE_EVENT_TYPE: the own feedback's received damage (the attacker is the target id).
KIND_BY_EVENT = (('RECEIVED_DAMAGE', 'received'),)
HANGAR_PANEL = 'otmetki.battle_hits'
LAYOUT = {'x': 20, 'y': 260, 'alignX': 'left', 'alignY': 'top'}
