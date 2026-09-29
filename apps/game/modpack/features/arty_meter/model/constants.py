from __future__ import absolute_import, division, print_function, unicode_literals

KIND = 'arty_meter'
# The thermometer's scale: shells of artillery fire (direct hits and splash) in one battle.
SCALE = 10
BOOK_FILE = 'arty_meter_%d.json'
BOOK_VERSION = 1
MAX_BATTLES = 500
MAX_TEXT = 60
DAY_FORMAT = '%Y-%m-%d'
DATE_FORMAT = '%d.%m %H:%M'
COUNTERS = ('hits', 'splash', 'damage', 'modules', 'stuns')
ACTION_CLEAR = 'clear'
TODAY_ROW = 'today'
SPG = 'SPG'

PREVIEW_SIZE = (220, 80)
PREVIEW_BATTLE = {'hits': 2, 'splash': 3, 'damage': 740, 'modules': 2, 'stuns': 3}
PREVIEW_DAY = {'battles': 7, 'hits': 6, 'splash': 11, 'damage': 2310, 'modules': 5, 'stuns': 9}
