from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 common/goodies/goodie_constants.MAX_ACTIVE_PERSONAL_BOOSTERS: personal reserves on at once.
MAX_ACTIVE = 3
# How often the hangar looks for a picked reserve that ran out (the client's own reserve timer ticks each minute).
CHECK_EVERY_S = 30.0
# A reserve without an expiry date sorts after every dated one: the one that expires first is used first.
NO_EXPIRY = 1 << 62

ACTION_ACTIVATE = 'activate_now'

REFUSE_UNSET = 'unset'
REFUSE_NOTHING = 'nothing'
REFUSE_FULL = 'full'
