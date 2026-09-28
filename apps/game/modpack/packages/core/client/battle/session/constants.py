from __future__ import absolute_import, division, print_function, unicode_literals

# The damage extra's checks in the order they are asked (feedback_events._DamageExtra, RU 1.45).
SOURCE_CHECKS = (
    ('isShot', 'shot'),
    ('isFire', 'fire'),
    ('isRam', 'ram'),
    ('isWorldCollision', 'world'),
    ('isDeathZone', 'world'),
)
