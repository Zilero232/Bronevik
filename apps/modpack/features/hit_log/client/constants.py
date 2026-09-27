from __future__ import absolute_import, division, print_function, unicode_literals

OUTCOME_BY_FEEDBACK = (
    ('VEHICLE_HIT', 'no_pen'),
    ('VEHICLE_RICOCHET', 'ricochet'),
    ('VEHICLE_ARMOR_PIERCED', 'pen'),
    ('VEHICLE_CRITICAL_HIT', 'crit'),
    ('VEHICLE_CRITICAL_HIT_DAMAGE', 'crit'),
    ('VEHICLE_CRITICAL_HIT_CHASSIS', 'crit'),
    ('VEHICLE_CRITICAL_HIT_CHASSIS_PIERCED', 'crit'),
    ('VEHICLE_ARMOR_SCREEN_BLOCKED', 'spaced'),
    ('VEHICLE_TRACK_BLOCKED', 'tracks'),
    ('VEHICLE_WHEEL_BLOCKED', 'tracks'),
    ('VEHICLE_ARMOR_MISSED', 'missed_armor'),
)
