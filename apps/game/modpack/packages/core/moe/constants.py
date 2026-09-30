# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

# The client's marks-of-excellence metric: damage + max(radio, track, stun assist) as a 100-battle EMA.
EMA_WINDOW = 100
EMA_K = 2.0 / (EMA_WINDOW + 1)
MARK_LEVELS = (65.0, 85.0, 95.0)
TARGET_LEVELS = (65.0, 85.0, 95.0, 100.0)
MAX_PERCENT = 100.0

# The battles-to-mark forecast: at most this many battles, and the pace from at least PACE_MIN of the
# last PACE_BATTLES own battles of the tank.
MAX_FORECAST_BATTLES = 999
PACE_BATTLES = 20
PACE_MIN = 3
PACE_TANKS = 300

# GET /v1/moe/<tank_id> answers are kept this long (a failed read for less).
THRESHOLD_TTL_S = 6 * 3600
THRESHOLD_ERROR_TTL_S = 10 * 60

REACHED = u'✓'
STAR = u'★'
UNREACHABLE = u'∞'
MACRO_MISSING = u'-'

# The mastery badges of GET /v1/moe/<tank_id> `mastery` (base XP of one battle per badge), with the dossier's
# markOfMastery value each one is: 1 third class, 2 second, 3 first, 4 Ace Tanker.
MASTERY_CLASSES = (('class3', 1), ('class2', 2), ('class1', 3), ('ace', 4))
