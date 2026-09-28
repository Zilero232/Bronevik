# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

SEPARATOR = u' · '
READY_MARK = u'✓'
# Cooldowns are counted down between the client's own updates.
TICK_S = 0.5

PREVIEW_SIZE = (320, 50)
PREVIEW_ITEMS = (
    (1, u'Аптечка', 1, True, 0),
    (2, u'Ремкомплект', 1, False, 12),
    (3, u'Огнетушитель', 1, True, 0),
)
PREVIEW_SHELLS = ((11, 'ap', 32), (12, 'apcr', 12), (13, 'he', 6))
