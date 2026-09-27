from __future__ import absolute_import, division, print_function, unicode_literals

import re

INDEX_FILE = 'replay_manager_%d.json'
INDEX_MAX = 500

NAME_MAX_CHARS = 100
SCAN_MAX_FILES = 400
FORBIDDEN_CHARS = re.compile(r'[<>:"/\\|?*\x00-\x1f]+')
RESERVED_NAMES = ('con', 'prn', 'aux', 'nul') + tuple('com%d' % n for n in range(1, 10)) + tuple('lpt%d' % n for n in range(1, 10))

ACTION_REFRESH = 'refresh'
ACTION_FOLDER = 'open_folder'
ACTION_RENAME = 'rename'
ACTION_DELETE = 'delete'

SITE_LIST_PATH = '/replays'
SITE_REPLAY_PATH = '/replays/%s'

ERROR_NAME = 'name'
ERROR_EXISTS = 'exists'
ERROR_MISSING = 'missing'
ERROR_NOT_OWN = 'not_own'

# The client may still be writing a replay: wait before naming it, give up on a battle without one.
AUTO_NAME_SETTLE_S = 10
AUTO_NAME_GIVE_UP_S = 30 * 60
AUTO_NAME_MATCH_S = 5 * 60
AUTO_NAME_CHECK_S = 15
