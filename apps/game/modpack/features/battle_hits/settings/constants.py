from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_battle_hits'
SECTION = 'battle_hits'
GROUP = 'hangar'

DEFAULTS = {
    'show_panel': True,
    'show_attacker': True,
    'keep_battles': 10,
}

LIMITS = {
    'keep_battles': (1, 30),
}
