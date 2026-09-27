from __future__ import absolute_import, division, print_function, unicode_literals

import re

HISTORY_FILE = 'marks_history_%d.json'
HISTORY_VERSION = 1
MAX_VEHICLES = 300
MAX_DETAIL_LINES = 12

SOURCE_BATTLE = 'battle'
SOURCE_HANGAR = 'hangar'

ACTION_CLEAR = 'clear'
SITE_PROGRESS_PATH = '/me/progress'

# "ussr:R04_T-34" -> "T-34": the nation prefix and the item code before the name.
ITEM_CODE = re.compile(r'^[A-Za-z]{1,3}\d+[A-Za-z]?_')
