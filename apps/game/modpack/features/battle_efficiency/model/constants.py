from __future__ import absolute_import, division, print_function, unicode_literals

# The WN8 formula (wnefficiency.net, the version the site computes): the ratios are cut at these floors, the frag,
# spot and defence ratios capped by the damage ratio plus these margins, the win ratio at WIN_CAP.
WIN_FLOOR = 0.71
DAMAGE_FLOOR = 0.22
FRAG_FLOOR = 0.12
SPOT_FLOOR = 0.38
DEF_FLOOR = 0.10
FRAG_MARGIN = 0.2
SPOT_MARGIN = 0.1
DEF_MARGIN = 0.1
WIN_CAP = 1.8
WEIGHT_DAMAGE = 980
WEIGHT_DAMAGE_FRAG = 210
WEIGHT_FRAG_SPOT = 155
WEIGHT_DEF_FRAG = 75
WEIGHT_WIN = 145

# The outcome is unknown until the battle ends: the estimate takes the tank's expected win rate (a neutral rWIN of 1).
NEUTRAL_WIN_RATIO = 1.0

KIND_BY_EVENT = (
    ('DAMAGE', 'damage'),
    ('SPOTTED', 'spot'),
    ('KILL', 'frag'),
    ('BASE_CAPTURE_DROPPED', 'def'),
)

PREVIEW_SIZE = (320, 50)
PREVIEW_TOTALS = {'damage': 2150, 'spot': 2, 'frag': 1, 'def': 0}
PREVIEW_ROW = {'avg_damage': 1720.0, 'wn8': {'value': 2104.9, 'tier': 'very_good'},
               'expected': {'damage': 1180.0, 'spot': 1.42, 'frag': 0.98, 'def': 0.75, 'win_rate': 52.3}}

# The card (model/widget.py), design px.
CARD_WIDTH = 260
