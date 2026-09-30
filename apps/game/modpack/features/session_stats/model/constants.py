# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_UP

REGULAR_BONUS_TYPE = 1
ACTION_RESET = 'new_session'
ACTION_REFRESH = 'refresh'
ACTION_SITE = 'site'
SITE_PATH = '/me'

# The strip of the last own battles of the session, oldest first: `result` of a battle event (companion/payload), its
# colour on the card (core/hud/widget TONES) and in the GUIFlash text.
RESULTS = ('win', 'loss', 'draw')
RECENT_LIMIT = 10
RESULT_TONES = {'win': 'good', 'loss': 'bad', 'draw': 'muted'}
RESULT_COLORS = {'win': COLOR_UP, 'loss': COLOR_DOWN, 'draw': COLOR_MUTED}
# An own battle waits for its results from the start until they arrive or this long has passed: a random battle lasts at
# most 15 minutes, and after a game restart the companion no longer looks for the results of earlier arenas.
PENDING_RESULTS_TTL_S = 30 * 60

# contract/session-share.schema.json.
SHARE_PATH = '/mod/me/session-share'
SHARE_SEND_PATH = '/mod/me/session-share/send'
CHANNELS = ('telegram', 'discord')
BOTH_CHANNELS = 'both'
SHARE_STATE_KEY = 'session_share_synced'
SHARE_RETRY_S = 300
ACTION_SHARE = 'share_now'
# A refused /send: 409 channel_not_linked and 404 session_not_found get their own short line.
SHARE_SEND_FAILURES = {404: 'session_share_not_found', 409: 'session_share_not_linked'}
SHARE_SEND_FAILED = 'session_share_failed'
# A /session-share answer: stored, refused until the player changes the switch (409 channel_not_linked: the chosen
# channel is not linked on the site, asking again cannot help), or asked again after SHARE_RETRY_S.
SHARE_SYNCED = 'synced'
SHARE_REFUSED = 'refused'
SHARE_RETRY = 'retry'
SHARE_REFUSED_STATUSES = (409,)
SHARE_REFUSED_NOTICE = 'session_share_not_linked'

COUNTERS = (
    'battles',
    'wins',
    'losses',
    'draws',
    'survived',
    'damage_dealt',
    'damage_assisted',
    'damage_blocked',
    'frags',
    'spotted',
    'xp',
    'credits',
    'shots',
    'direct_enemy_hits',
    'piercing_enemy_hits',
)
# The counters a battle event's `stats` (companion/payload) carries under the same name; the assist counter sums
# ASSISTED_STATS.
STAT_COUNTERS = (
    'damage_dealt',
    'damage_blocked',
    'frags',
    'spotted',
    'xp',
    'credits',
    'shots',
    'direct_enemy_hits',
    'piercing_enemy_hits',
)
ASSISTED_STATS = ('damage_assisted_radio', 'damage_assisted_track', 'damage_assisted_stun')
VEHICLE_COUNTERS = ('battles', 'wins', 'damage_dealt')

# The MoE change per tank of the session (model/moe.py): its state key and the tanks the card lists, newest first.
MOE_STATE_KEY = 'session_moe'
MOE_ROWS = 3

# The hangar card (model/widget.py): width in design px, the win rate from which it shows as good.
CARD_WIDTH = 264
EVEN_WIN_RATE = 50.0
# The GUIFlash text's header size (model/text.py).
TITLE_SIZE = 15

# contract/goals.schema.json: the goals set on the site's «Мой кабинет» page.
GOALS_PATH = '/mod/me/goals'
GOALS_KEY = 'goals'
# The state key of the retired session_goals feature: the goals it already announced stay announced.
GOALS_STATE_KEY = 'session_goals_done'
GOAL_METRICS = ('winRate', 'wn8', 'avgDamage', 'battles', 'moe', 'broneIndex')
PERCENT_METRICS = ('winRate', 'moe')
SHOWN_STATUSES = ('active', 'achieved')
ACTIVE = 'active'
ACHIEVED = 'achieved'
MAX_GOALS = 20
MAX_REMEMBERED = 100
DONE_MARK = u'✓'
GOAL_SOUND = 'otmetki_goal'

# contract/ratings.schema.json: the account overview; its `session` repeats the card's own numbers and is not read.
OVERVIEW_PATH = '/mod/me/overview'
OVERVIEW_KEY = 'overview'
ACCOUNT_RATINGS = ('wn8', 'eff')
# The account line's facts after its WN8, in this order, each behind its `metric_<name>` switch.
ACCOUNT_FACTS = ('win_rate', 'avg_damage', 'eff')
METRIC_KEY = 'metric_%s'
FACT_SEPARATOR = u' · '

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
# RATING_SCALES.wn8 of @otmetki/ratings (lower bound, tier): the ingest answer's session WN8 carries no tier.
WN8_SCALE = (
    (0, 'very_bad'),
    (300, 'bad'),
    (650, 'below_avg'),
    (900, 'avg'),
    (1200, 'good'),
    (1600, 'very_good'),
    (2000, 'great'),
    (2450, 'unicum'),
    (2900, 'super_unicum'),
)
WN8_BOUNDS = tuple(bound for bound, _ in WN8_SCALE)
