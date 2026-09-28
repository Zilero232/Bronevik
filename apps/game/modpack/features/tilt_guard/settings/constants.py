from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_tilt_guard'
SECTION = 'tilt_guard'
GROUP = 'hangar'

DEFAULTS = {
    'loss_streak': 3,
    'session_battles': 30,
    'damage_drop': True,
}
LIMITS = {
    'loss_streak': (0, 10),
    'session_battles': (0, 200),
}
