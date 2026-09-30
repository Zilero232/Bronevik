from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_battle_results'
SECTION = 'battle_results'
MAX_TEMPLATE = 1000
BONUS_TYPES = ('random', 'all')

DEFAULTS = {
    'show_economy': True,
    'show_combat': True,
    'show_marks': True,
    'colored': True,
    'bonus_types': 'all',
    'template': '',
    'history_size': 30,
    'hits_tab': True,
    'hits_keep_battles': 10,
    'hits_show_attacker': True,
}

LIMITS = {'history_size': (10, 100), 'hits_keep_battles': (1, 30)}
