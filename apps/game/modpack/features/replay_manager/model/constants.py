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

ALL = 'all'
UNKNOWN_RESULT = 'unknown'
RESULTS = (ALL, 'win', 'loss', 'draw', UNKNOWN_RESULT)
PERIODS = (ALL, 'today', 'week', 'month')
PERIOD_SECONDS = {'today': 24 * 3600, 'week': 7 * 24 * 3600, 'month': 30 * 24 * 3600}
SORTS = ('newest', 'oldest', 'damage', 'size')
SORT_KEYS = {
    'newest': ('time', True),
    'oldest': ('time', False),
    'damage': ('damage', True),
    'size': ('size', True),
}

# contract/replay-analysis.schema.json (not served yet, README TODO): the site's analysis of an uploaded replay.
ANALYSIS_PATH = '/mod/me/replays'
ANALYSIS_POLL_S = 60
ANALYSIS_WATCH_S = 6 * 3600
ANALYSIS_IDS_PER_READ = 20
PARSED = 'parsed'
ANALYSIS_FINAL = (PARSED, 'failed')
# A server without the endpoint answers 404: stop asking for this game session.
NOT_SERVED_STATUS = 404
