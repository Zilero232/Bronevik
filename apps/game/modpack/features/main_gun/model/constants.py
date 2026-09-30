# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP

# RU 1.45 client source, common/arena_achievements.py ACHIEVEMENT_CONDITIONS['mainGun']: at least 1000 damage and at
# least 20% of the enemy team's total HP. text/ru/lc_messages/achievements.po mainGun_condition adds: never hit allies
# with direct shots, random battles only; mainGun_descr: the most damage in the battle, which only the server knows.
MIN_DAMAGE = 1000
MIN_SHARE_OF_ENEMY_HP = 0.2

# The state numbers the texts show with digit grouping.
SHOWN_NUMBERS = ('damage', 'need', 'left', 'remaining', 'team')
# The team line is a little smaller than the status line, never below this size.
TEAM_LINE_SHRINK = 2
MIN_TEAM_LINE_SIZE = 8

# The medal's state for the player: still to earn, threshold reached, out of reach (the enemies have less HP left than
# the damage still needed), lost (an own shot hit an ally).
PROGRESS = 'progress'
REACHED = 'reached'
UNREACHABLE = 'unreachable'
FAILED = 'failed'

# The client's own message for an own shot that hit an ally («Попадание в союзника»): Avatar.showShotResults sends it
# for an ally hit by a direct projectile or damaged by the shot (msgs_ctrl.showAllyHitMessage, RU 1.45).
ALLY_HIT_MESSAGE = 'ALLY_HIT'

# How each state looks: the text line (i18n key, colour, the muted tail after it) and the card row (status mark, tone,
# note).
STATE_LOOKS = {
    PROGRESS: {
        'line': 'main_gun_progress',
        'color': COLOR_NEUTRAL,
        'tail': 'main_gun_left',
        'status': 'active',
        'tone': 'gold',
        'note': 'main_gun_row_left',
    },
    REACHED: {
        'line': 'main_gun_reached',
        'color': COLOR_UP,
        'tail': None,
        'status': 'done',
        'tone': 'success',
        'note': None,
    },
    UNREACHABLE: {
        'line': 'main_gun_unreachable',
        'color': COLOR_MUTED,
        'tail': None,
        'status': 'idle',
        'tone': 'muted',
        'note': 'main_gun_row_unreachable',
    },
    FAILED: {
        'line': 'main_gun_failed',
        'color': COLOR_DOWN,
        'tail': None,
        'status': 'failed',
        'tone': 'bad',
        'note': 'main_gun_row_failed',
    },
}

PREVIEW_SIZE = (320, 50)
PREVIEW_OWN_DAMAGE = 1850
PREVIEW_ENEMY_MAX = 14700
PREVIEW_ENEMY_HP = 8580

# The card (model/widget.py), design px.
CARD_WIDTH = 260
