from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_marks_history'
SECTION = 'marks_history'
GROUP = 'hangar'

DEFAULTS = {
    'max_entries': 100,
    'show_panel': True,
    'trend_battles': 5,
    'page_rows': 50,
}

LIMITS = {
    'max_entries': (10, 500),
    'trend_battles': (1, 50),
    'page_rows': (10, 200),
}
