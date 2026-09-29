# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

SEPARATOR = u' · '
READY_MARK = u'✓'
# Cooldowns are counted down between the client's own updates.
TICK_S = 0.5

PREVIEW_SIZE = (320, 70)
PREVIEW_ITEMS = (
    (1, u'Аптечка', 1, True, 0, 'smallMedkit', 90),
    (2, u'Ремкомплект', 1, False, 12, 'smallRepairkit', 90),
    (3, u'Огнетушитель', 1, True, 0, 'handExtinguishers', 60),
)
PREVIEW_SHELLS = ((11, 'ap', 32, 'ARMOR_PIERCING'), (12, 'apcr', 12, 'ARMOR_PIERCING_CR_PREMIUM'), (13, 'he', 6, 'HIGH_EXPLOSIVE'))

KIND = 'consumables'
PREVIEW_STATS = ((11, 258, 390, 1000), (12, 330, 390, 1250), (13, 60, 480, 750))
PREVIEW_CURRENT = 11
