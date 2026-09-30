from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_personal_missions'
SECTION = 'personal_missions'
GROUP = 'hangar'

DEFAULTS = {
    'font_size': 14,
    'show_hangar': True,
    'show_conditions': True,
    'max_missions': 3,
}
LIMITS = {'font_size': (8, 32), 'max_missions': (1, 6)}
