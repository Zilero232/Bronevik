# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import re

HISTORY_FILE = 'marks_history_%d.json'
HISTORY_VERSION = 1
MAX_VEHICLES = 300
MAX_DETAIL_LINES = 12

SOURCE_BATTLE = 'battle'
SOURCE_HANGAR = 'hangar'

ACTION_CLEAR = 'clear'

# The «Расчёт отметок» report: battles in its table, entries in its chart, the windows of its trends.
REPORT_BATTLES = 25
REPORT_CHART = 100
REPORT_TRENDS = (10, 25)
# nations.NAMES of the RU 1.45 client, in the order of a compact descriptor's nation index.
NATION_NAMES = ('ussr', 'germany', 'usa', 'china', 'france', 'uk', 'japan', 'czech', 'sweden', 'poland', 'italy', 'intunion')
CLASS_TAGS = ('lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG')
SITE_PROGRESS_PATH = '/me/progress'

# "ussr:R04_T-34" -> "T-34": the nation prefix and the item code before the name.
ITEM_CODE = re.compile(r'^[A-Za-z]{1,3}\d+[A-Za-z]?_')

# The hangar card (model/widget.py), design px.
CARD_WIDTH = 260
