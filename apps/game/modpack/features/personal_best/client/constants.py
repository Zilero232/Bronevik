from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: the vehicle dossier's max15x15 records (maxDamage, maxAssisted, maxFrags, maxXP) are updated
# for every bonus type with the DOSSIER_MAX15X15 cap (dossiers2/custom/battle_results_processors.py:288, 432), read as
# arena_bonus_type_caps.ARENA_BONUS_TYPE_CAPS.checkAny(bonusType, cap). The cap is taken from the class: checkAny
# matches only a native str, so a unicode literal would never match on Python 2.
CAPS_MODULE = 'arena_bonus_type_caps'
CAPS_CLASS = 'ARENA_BONUS_TYPE_CAPS'
DOSSIER_CAP = 'DOSSIER_MAX15X15'
