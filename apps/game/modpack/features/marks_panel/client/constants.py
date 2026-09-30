from __future__ import absolute_import, division, print_function, unicode_literals

KIND_BY_EVENT = (
    ('DAMAGE', 'damage'),
    ('RADIO_ASSIST', 'radio'),
    ('TRACK_ASSIST', 'track'),
    ('STUN_ASSIST', 'stun'),
)
# The hangar reads the tank's marks from its dossier (companion marks `vehicle_moe`); a tank below the marks tier or
# without a moving average has none, and the battle panel then stays off.
NO_SNAPSHOT = 'no hangar marks snapshot of tank %s (below tier 5 or no damage average yet)'
