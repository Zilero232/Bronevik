# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.panel import dock_layout

# RU 1.45 client source: comp7_ranks_common.Comp7Division.rank counts from 1 (Iron) to 6 (Legend) as comp7.po
# rank/first ... rank/sixth; `index` 1..5 is the division letter A..E (gui.impl.gen ...
# comp7.division_info_model.Division), A the top.
CHAMPION_RANK = 5
LEGEND_RANK = 6
THRESHOLD_RANKS = (CHAMPION_RANK, LEGEND_RANK)
DIVISION_LETTERS = {1: u'A', 2: u'B', 3: u'C', 4: u'D', 5: u'E'}
RANK_IDS = (1, 2, 3, 4, 5, 6)
MAX_SKILL = 40
REFRESH_EVERY_S = 2.0

HANGAR_PANEL = 'otmetki.comp7_helper'
HANGAR_LAYOUT = dock_layout('hangar_right')
TITLE_SIZE_STEP = 2

# The hangar card (model/widget.py), design px.
CARD_WIDTH = 260
# A threshold row's colour role by its status (the card widget's tones).
STATUS_TONES = {'active': 'gold', 'done': 'success', 'idle': 'muted'}
