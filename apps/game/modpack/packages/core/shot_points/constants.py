from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 VehicleEffects.DamageFromShotDecoder.decodeSegment: a shot point packs the hit effect code in the low byte,
# the tank part index in the next one, then a byte per axis (of the part's bounding box) for its start and its end.
BYTE = 255.0
BYTE_MASK = 0xFF
PART_SHIFT = 8
START_SHIFTS = (16, 24, 32)
END_SHIFTS = (40, 48, 56)
