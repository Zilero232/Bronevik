from __future__ import absolute_import, division, print_function, unicode_literals

MAX_TEMPLATE = 100
MAX_SEARCH = 60
DEFAULT_NAME_TEMPLATE = '{date}_{time}_{map}_{vehicle}_{result}'

SWITCH = 'hangar_replay_manager'
GROUP = 'hangar'

DEFAULTS = {
    'search': '',
    'filter_result': 'all',
    'period': 'all',
    'sort': 'newest',
    'notify_analysis': True,
    'max_rows': 50,
    'uploaded_only': False,
    'auto_rename': False,
    'name_template': DEFAULT_NAME_TEMPLATE,
}

LIMITS = {
    'max_rows': (10, 200),
}
