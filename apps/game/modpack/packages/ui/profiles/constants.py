from __future__ import absolute_import, division, print_function, unicode_literals

from ..window_layout import SECTION as WINDOW_SECTION

FILE_NAME = 'profiles.json'
FILE_VERSION = 1
MAX_PROFILES = 12
NAME_MAX_LENGTH = 40

EXCLUDED_CONFIG_KEYS = (
    'server_url',
    'bind_code',
    'settings_action',
    'settings_target',
    'settings_anonymous_stats',
    'share_settings',
    'upload_replays',
    'publish_replays',
    'share_session_report',
)
EXCLUDED_CONFIG_PREFIXES = ('send_', 'settings_include_')
# Where the settings window sits depends on the player's screen, so it never travels in a profile or its code.
EXCLUDED_SECTIONS = (WINDOW_SECTION,)

CODE_PREFIX = 'TM1.'
CODE_MAX_CHARS = 48 * 1024

ERROR_LIMIT = 'limit'
ERROR_NAME = 'name'
ERROR_MISSING = 'missing'
ERROR_CODE = 'code'
