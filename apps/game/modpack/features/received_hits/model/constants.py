# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_UP, COLOR_WARN

OUTCOMES = ('pen', 'crit', 'blocked', 'ricochet')
BLOCKING = ('blocked', 'ricochet')
TOTAL_KEYS = ('hits', 'pen', 'crit', 'blocked', 'ricochet', 'damage', 'blocked_damage')
OUTCOME_COLORS = {'pen': COLOR_DOWN, 'crit': COLOR_WARN, 'blocked': COLOR_UP, 'ricochet': COLOR_MUTED}
# A shot's crits arrive as a separate RECEIVED_CRIT event right after its damage: they join that line.
MERGE_WINDOW_S = 1.0
# RU 1.45 common/constants.VEHICLE_HIT_EFFECT.RICOCHETS (INTERMEDIATE_RICOCHET, FINAL_RICOCHET): the hit effect code of
# a shot's last point (Vehicle.showDamageFromShot, VehicleEffects.DamageFromShotDecoder.decodeSegment: the low byte)
# tells a ricochet apart; the own feedback's TANKING does not. The two arrive close together, in either order.
RICOCHET_CODES = (1, 2)
MAX_ENTRIES = 40
SEPARATOR = u' · '
MINUS = u'−'

PREVIEW_SIZE = (320, 110)
PREVIEW_HITS = (
    ('Pz. IV', 'mediumTank', 'ap', 'pen', 390, 1),
    ('KV-1', 'heavyTank', 'he', 'blocked', 240, 0),
    ('T-34', 'mediumTank', 'apcr', 'ricochet', 0, 0),
)

# The card (model/widget.py): width in design px and the colour role of each outcome.
CARD_WIDTH = 260
OUTCOME_TONES = {'pen': 'received', 'crit': 'warning', 'blocked': 'blocked', 'ricochet': 'blocked'}
