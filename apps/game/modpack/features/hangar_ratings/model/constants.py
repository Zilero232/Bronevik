# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

OVERVIEW_PATH = '/mod/me/overview'
TANKS_PATH = '/mod/me/tanks'
SITE_PATH = '/me/analytics'

# contract/ratings.schema.json: tanksRequest.tank_ids maxItems, the same as MOD_RATINGS.maxTanks on the server.
MAX_TANKS = 100
MAX_MARKS = 3
MAX_MASTERY = 4

OVERVIEW_KEY = 'overview'
TANK_KEY = 'tank:%d'

# The ingest flush runs every 15 s in the hangar; the live session on the site is updated only then.
REFRESH_AFTER_BATTLE_S = 20.0
RETRY_AFTER_ERROR_S = 120.0
RETRY_AFTER_LIMIT_S = 60.0
MAX_RETRY_S = 1800.0

AUTH_STATUSES = (401, 403)
RATE_LIMITED_STATUS = 429

ACTION_REFRESH = 'refresh'
ACTION_SITE = 'site'

RATING_TIERS = ('very_bad', 'bad', 'below_avg', 'avg', 'good', 'very_good', 'great', 'unicum', 'super_unicum')

# One colour per tier of the site's rating scale (RATING_TIERS in @otmetki/ratings), worst to best, XVM-style.
TIER_COLORS = {
    'very_bad': '#E3564A',
    'bad': '#F08A3E',
    'below_avg': '#F2C94C',
    'avg': '#D9D9B8',
    'good': '#7CD35B',
    'very_good': '#4FC3B0',
    'great': '#5B9BF2',
    'unicum': '#A06CF0',
    'super_unicum': '#D75BD9',
}

ACCOUNT_METRICS = ('wn8', 'eff', 'brone_index', 'win_rate', 'battles', 'avg_damage')
SESSION_METRICS = ('wn8', 'brone_index', 'win_rate', 'battles', 'avg_damage')
TANK_METRICS = ('wn8', 'win_rate', 'battles', 'avg_damage', 'moe', 'mastery')
RATING_METRICS = ('wn8', 'eff', 'brone_index')

METRIC_KEY = 'metric_%s'
METRIC_SEPARATOR = u' · '
STAR = u'★'
TITLE_SIZE_STEP = 2
SESSION_RATINGS = ('wn8', 'brone_index')
TANK_RATINGS = ('wn8',)
