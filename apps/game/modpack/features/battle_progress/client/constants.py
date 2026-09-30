# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: the vehicle dossier's max15x15 records (maxDamage, maxAssisted, maxFrags, maxXP) are updated
# for every bonus type with the DOSSIER_MAX15X15 cap (dossiers2/custom/battle_results_processors.py:288, 432), read as
# arena_bonus_type_caps.ARENA_BONUS_TYPE_CAPS.checkAny(bonusType, cap). The cap is taken from the class: checkAny
# matches only a native str, so a unicode literal would never match on Python 2.
CAPS_MODULE = 'arena_bonus_type_caps'
CAPS_CLASS = 'ARENA_BONUS_TYPE_CAPS'
DOSSIER_CAP = 'DOSSIER_MAX15X15'

# RU 1.45 client source: gui/shared/gui_items/dossier/stats.py, the random-battle stats of a vehicle dossier
# (the max15x15 block) expose getMaxDamage / getMaxAssisted / getMaxFrags / getMaxXp; the carousel's own tooltip
# and the vehicle's achievements page read the same block.
DOSSIER_GETTERS = (
    ('damage', 'getMaxDamage'),
    ('assist', 'getMaxAssisted'),
    ('frags', 'getMaxFrags'),
    ('xp', 'getMaxXp'),
)

# The client's own message for an own shot that hit an ally («Попадание в союзника»): Avatar.showShotResults sends it
# for an ally hit by a direct projectile or damaged by the shot (msgs_ctrl.showAllyHitMessage, RU 1.45).
ALLY_HIT_MESSAGE = 'ALLY_HIT'

# A reached threshold shows its full bar this long (s), then the row keeps one line.
REACHED_BAR_S = 3.0
