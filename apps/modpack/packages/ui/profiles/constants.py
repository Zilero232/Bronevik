from __future__ import absolute_import, division, print_function, unicode_literals

FILE_NAME = 'profiles.json'
FILE_VERSION = 1
MAX_PROFILES = 12
NAME_MAX_LENGTH = 40

EXCLUDED_CONFIG_KEYS = ('server_url', 'bind_code', 'settings_action')

CODE_PREFIX = 'TM1.'
CODE_MAX_CHARS = 48 * 1024

ERROR_LIMIT = 'limit'
ERROR_NAME = 'name'
ERROR_MISSING = 'missing'
ERROR_CODE = 'code'
