# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_UP, COLOR_WARN

OUTCOMES = ('pen', 'crit', 'blocked', 'ricochet')
OUTCOME_COLORS = {'pen': COLOR_DOWN, 'crit': COLOR_WARN, 'blocked': COLOR_UP, 'ricochet': COLOR_MUTED}
# A shot's crits arrive as a separate RECEIVED_CRIT event right after its damage: they join that line.
MERGE_WINDOW_S = 1.0
MAX_ENTRIES = 40
SEPARATOR = u' · '
MINUS = u'−'

PREVIEW_SIZE = (320, 110)
PREVIEW_HITS = (
    ('Pz. IV', 'mediumTank', 'ap', 'pen', 390, 1),
    ('KV-1', 'heavyTank', 'he', 'blocked', 240, 0),
    ('T-34', 'mediumTank', 'apcr', 'ricochet', 0, 0),
)
