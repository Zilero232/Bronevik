from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_ratings'
SECTION = 'hangar_ratings'
GROUP = 'hangar'

ALIGN_X = ('left', 'center', 'right')
ALIGN_Y = ('top', 'center', 'bottom')

DEFAULTS = {
    'show_account': True,
    'show_session': True,
    'show_tank': True,
    'metric_wn8': True,
    'metric_eff': False,
    'metric_brone_index': True,
    'metric_win_rate': True,
    'metric_battles': True,
    'metric_avg_damage': True,
    'metric_moe': True,
    'metric_mastery': True,
    'colored': True,
    'font_size': 13,
    'x': 20,
    'y': 140,
    'align_x': 'left',
    'align_y': 'top',
}

CHOICES = {
    'align_x': ALIGN_X,
    'align_y': ALIGN_Y,
}

LIMITS = {
    'font_size': (8, 48),
    'x': (-4000, 4000),
    'y': (-4000, 4000),
}
