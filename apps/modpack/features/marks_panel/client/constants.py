from __future__ import absolute_import, division, print_function, unicode_literals

BATTLE_PANEL = 'otmetki.moe'
LAYOUT = {'x': 0, 'y': 120, 'alignX': 'center', 'alignY': 'top'}
MOE_PATH = '/v1/moe/%d'
THRESHOLD_TTL_S = 6 * 3600
THRESHOLD_ERROR_TTL_S = 10 * 60
KIND_BY_EVENT = (
    ('DAMAGE', 'damage'),
    ('RADIO_ASSIST', 'radio'),
    ('TRACK_ASSIST', 'track'),
    ('STUN_ASSIST', 'stun'),
)
