from __future__ import absolute_import, division, print_function, unicode_literals

REGULAR_BONUS_TYPE = 1

# contract/session-share.schema.json (not served yet, README TODO).
SHARE_PATH = '/mod/me/session-share'
SHARE_SEND_PATH = '/mod/me/session-share/send'
CHANNELS = ('telegram', 'discord')
BOTH_CHANNELS = 'both'
SHARE_STATE_KEY = 'session_share_synced'
SHARE_RETRY_S = 300
ACTION_SHARE = 'share_now'
SHARE_SEND_FAILURES = {404: 'session_share_not_found', 409: 'session_share_not_linked'}
SHARE_SEND_FAILED = 'session_share_failed'

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
