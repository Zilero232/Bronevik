# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 common/constants.py ARENA_BONUS_TYPE: CLAN (5), GLOBAL_MAP (13), SORTIE_2 (17, stronghold skirmishes),
# FORT_BATTLE_2 (18, stronghold advances). UNVERIFIED on Lesta 1.45: the ids of the clan modes after the rework.
CLAN_BONUS_TYPES = (5, 13, 17, 18)
SESSION_IDLE_S = 60 * 60
MAX_MEMBERS = 3
MAX_NAME = 24
READY_MARK = u'✓'
WAITING_MARK = u'…'
REFRESH_EVERY_S = 2.0

HANGAR_PANEL = 'otmetki.platoon_helper'
HANGAR_LAYOUT = {'x': -20, 'y': 520, 'alignX': 'right', 'alignY': 'top'}
TITLE_SIZE_STEP = 2
