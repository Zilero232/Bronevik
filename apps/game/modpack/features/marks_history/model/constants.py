# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import re

from ....core.format import COLOR_DOWN, COLOR_NEUTRAL, COLOR_UP

HISTORY_FILE = 'marks_history_%d.json'
HISTORY_VERSION = 1
MAX_VEHICLES = 300
MAX_DETAIL_LINES = 12

SOURCE_BATTLE = 'battle'
SOURCE_HANGAR = 'hangar'
# The dossier values of an entry: a hangar snapshot equal to the last entry in all of them is not recorded again.
READING_KEYS = ('rating', 'avg', 'marks')
# A battle's combined damage is the damage dealt plus the best of these assists (the MoE formula).
ASSIST_STATS = ('damage_assisted_radio', 'damage_assisted_track', 'damage_assisted_stun')

ACTION_CLEAR = 'clear'

# The «Расчёт отметок» report: battles in its table, entries in its chart, the windows of its trends.
REPORT_BATTLES = 25
REPORT_CHART = 100
REPORT_TRENDS = (10, 25)
# nations.NAMES of the RU 1.45 client, in the order of a compact descriptor's nation index.
NATION_NAMES = (
    'ussr',
    'germany',
    'usa',
    'china',
    'france',
    'uk',
    'japan',
    'czech',
    'sweden',
    'poland',
    'italy',
    'intunion',
)
NATION_BITS_SHIFT = 4
NATION_BITS_MASK = 15
CLASS_TAGS = ('lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG')
SITE_PROGRESS_PATH = '/me/progress'

# "ussr:R04_T-34" -> "T-34": the nation prefix and the item code before the name.
ITEM_CODE = re.compile(r'^[A-Za-z]{1,3}\d+[A-Za-z]?_')

PERCENT_FORMAT = u'%.2f%%'
NO_VALUE = u'—'
STAR = u'★'
ENTRY_MOMENT_FORMAT = '%d.%m %H:%M'
PANEL_TITLE_SIZE = 15

# By the sign of a change (-1, 0, 1): its colour in the text panel, its tone and glyph on the card.
DELTA_COLORS = {1: COLOR_UP, 0: COLOR_NEUTRAL, -1: COLOR_DOWN}
DELTA_TONES = {1: 'good', 0: 'muted', -1: 'bad'}
DELTA_GLYPHS = {1: 'trend_up', 0: 'dot', -1: 'trend_down'}

# The hangar card (model/widget.py), design px.
CARD_WIDTH = 260
