from __future__ import absolute_import, division, print_function, unicode_literals

RANDOM_BONUS_TYPE = 1
# A gap this long between two battles starts a new session (the session panel's default idle time).
SESSION_IDLE_S = 60 * 60
# The damage drop compares the last RECENT_BATTLES with the session's earlier ones, once there are MIN_EARLIER of those.
RECENT_BATTLES = 5
MIN_EARLIER = 5
DAMAGE_DROP_SHARE = 0.7
MAX_BATTLES = 300
NOTICES = ('streak', 'long', 'damage')
