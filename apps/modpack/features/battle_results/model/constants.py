from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_NEUTRAL, COLOR_UP

RANDOM_BONUS_TYPE = 1
RESULT_COLORS = {'win': COLOR_UP, 'loss': COLOR_DOWN, 'draw': COLOR_NEUTRAL}

STATE_KEY = 'battle_results_history'
SESSION_ROW = 'session'
ACTION_CLEAR = 'clear'
SITE_BATTLES_PATH = '/me/battles'
HISTORY_KEYS = ('arena', 'time', 'result', 'bonus_type', 'vehicle', 'tier', 'map', 'duration', 'xp', 'free_xp', 'credits', 'repair', 'ammo',
                'consumables', 'net_credits', 'damage', 'assist', 'assist_radio', 'assist_track', 'assist_stun', 'blocked', 'frags',
                'spotted', 'shots', 'hits', 'pens', 'life_time', 'alive', 'moe_percent', 'moe_delta', 'marks_on_gun')
