from __future__ import absolute_import, division, print_function, unicode_literals

OUTCOMES = ('pen', 'crit', 'no_pen', 'ricochet', 'spaced', 'tracks', 'missed_armor')
MERGE_WINDOW_S = 2.0
# The markers a damaging shot can carry (feedback_adaptor.__getHitResultEventID, RU 1.45 client source): the others
# (ricochet, spaced armour, tracks, missed armour) come only with damageFactor 0. no_pen takes an HE splash.
DAMAGE_OUTCOMES = ('pen', 'crit', 'no_pen')
MAX_ENTRIES = 60

PREVIEW_HITS = (
    (1, 'Pz. IV', 'pen', 390, 'ap', 510),
    (2, 'T-34', 'ricochet', None, None, None),
    (3, 'KV-1', 'pen', 280, 'heat', 360),
)
PREVIEW_SIZE = (300, 110)

# {c_outcome} per palette, in OUTCOMES order: pen, crit, no_pen, ricochet, spaced, tracks, missed_armor. graphite is
# @otmetki/design-tokens, colorblind the Okabe-Ito set.
OUTCOME_COLORS = {
    'classic': ('#7CD35B', '#F2B25B', '#E3564A', '#A09A8B', '#9EC9F5', '#C8B26A', '#A09A8B'),
    'graphite': ('#FF7A1A', '#E8B84A', '#8EA4B5', '#A3A3AD', '#80A6CC', '#A9B56C', '#9797A0'),
    'contrast': ('#80FF40', '#FFD23F', '#FF4040', '#C0C0C0', '#40C0FF', '#FF9F40', '#C0C0C0'),
    'colorblind': ('#009E73', '#E69F00', '#D55E00', '#999999', '#56B4E9', '#F0E442', '#999999'),
}
