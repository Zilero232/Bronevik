from __future__ import absolute_import, division, print_function, unicode_literals

REGULAR_BONUS_TYPE = 1

# contract/session-share.schema.json.
SHARE_PATH = '/mod/me/session-share'
SHARE_SEND_PATH = '/mod/me/session-share/send'
CHANNELS = ('telegram', 'discord')
BOTH_CHANNELS = 'both'
SHARE_STATE_KEY = 'session_share_synced'
SHARE_RETRY_S = 300
ACTION_SHARE = 'share_now'
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
