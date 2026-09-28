# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.me.constants import (MAX_RETRY_S, MAX_TANKS, RATING_TIERS, REFRESH_AFTER_BATTLE_S, RETRY_AFTER_ERROR_S,  # noqa: F401
                                   RETRY_AFTER_LIMIT_S, TANKS_PATH)

OVERVIEW_PATH = '/mod/me/overview'
SITE_PATH = '/me/analytics'

OVERVIEW_KEY = 'overview'

ACTION_REFRESH = 'refresh'
ACTION_SITE = 'site'

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
