from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_UP

REGULAR_BONUS_TYPE = 1
ACTION_RESET = 'new_session'

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

# The hangar card (model/widget.py): width in design px, the win rate from which it shows as good.
CARD_WIDTH = 260
EVEN_WIN_RATE = 50.0
