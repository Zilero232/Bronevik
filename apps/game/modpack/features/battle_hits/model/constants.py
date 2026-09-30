# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

BOOK_FILE = 'battle_hits_%d.json'
BOOK_VERSION = 1
MAX_BATTLES = 30
MAX_HITS = 80
MAX_DETAIL_HITS = 20
# The own feedback's received damage and the hit's points arrive close together, in either order.
DAMAGE_WINDOW_S = 1.0
ACTION_CLEAR = 'clear'
SEPARATOR = u' · '
MINUS = u'−'
# The hangar card (model/widget.py), design px.
CARD_WIDTH = 260

# RU 1.45 client source (vehicle_systems/tankStructure.TankPartIndexes): 0 chassis, 1 hull, 2 turret, 3 gun; higher
# indices are the chassis' track pairs (VehicleEffects.DamageFromShotDecoder.convertComponentIndex).
PART_NAMES = ('chassis', 'hull', 'turret', 'gun')
PART_ORDER = ('hull', 'turret', 'gun', 'chassis')
# RU 1.45 common/constants.VEHICLE_HIT_EFFECT: 0 pierced without damage, 1-2 ricochets, 3 not pierced, 4 pierced,
# 5 critical hit, 6 pierced with a damaged device.
OUTCOME_BY_CODE = {0: 'nodamage', 1: 'ricochet', 2: 'ricochet', 3: 'blocked', 4: 'pen', 5: 'crit', 6: 'crit'}
OUTCOMES = ('pen', 'crit', 'blocked', 'ricochet', 'nodamage')
DAMAGING = ('pen', 'crit')
SIDED_PARTS = ('hull', 'turret')
SIDES = ('front', 'left', 'right', 'rear')
# RU 1.45 VehicleEffects.decodeSegment: each point is a byte per axis of the part's bounding box.
BYTE = 255.0
START_SHIFTS = (16, 24, 32)
END_SHIFTS = (40, 48, 56)
# A stored point: fractions of the part's box along each axis.
AXES = ('x', 'y', 'z')
MIDDLE = 0.5
FRONT_Z = 0.7
REAR_Z = 0.3

# The hangar schematic, seen from above with the front on top: (x, y, width, height) as fractions of the picture.
FIGURE = {
    'chassis_left': (0.06, 0.06, 0.14, 0.88),
    'chassis_right': (0.8, 0.06, 0.14, 0.88),
    'hull': (0.2, 0.1, 0.6, 0.82),
    'turret': (0.32, 0.36, 0.36, 0.34),
    'gun': (0.47, 0.0, 0.06, 0.36),
}
FIGURE_ORDER = ('chassis_left', 'chassis_right', 'hull', 'turret', 'gun')
