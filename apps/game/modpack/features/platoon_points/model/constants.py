# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

KIND = 'platoon_points'
MAX_NAME = 24
PREVIEW_SIZE = (240, 90)
# (vehicle id, name, own, class tag, max HP, HP, alive, frags)
PREVIEW_MEMBERS = (
    (1, u'Вы', True, 'heavyTank', 2000, 1340, True, 2),
    (2, u'Союзник', False, 'mediumTank', 1600, 0, False, 1),
)
PREVIEW_OWN = {'damage': 2450, 'assist': 610}
