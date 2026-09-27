from __future__ import absolute_import, division, print_function, unicode_literals

INDEX_FILE = 'replay_manager_%d.json'
INDEX_MAX = 500

NAME_MAX_CHARS = 100
SCAN_MAX_FILES = 400

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
