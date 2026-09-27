from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_chat_filter'
SECTION = 'chat_filter'
GROUP = 'battle'
MAX_WORDS = 500

TIMESTAMP_FORMATS = ('', '%H:%M', '%H:%M:%S')

DEFAULTS = {
    'timestamp_format': '%H:%M:%S',
    'filter_duplicates': True,
    'duplicate_window_s': 30,
    'rate_limit': 4,
    'rate_window_s': 10,
    'filter_commands': True,
    'block_words': '',
}

CHOICES = {'timestamp_format': TIMESTAMP_FORMATS}

LIMITS = {
    'duplicate_window_s': (5, 300),
    'rate_limit': (0, 20),
    'rate_window_s': (5, 60),
}
