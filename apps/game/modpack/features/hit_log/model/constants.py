from __future__ import absolute_import, division, print_function, unicode_literals

OUTCOMES = ('pen', 'crit', 'no_pen', 'ricochet', 'spaced', 'tracks', 'missed_armor')
MERGE_WINDOW_S = 2.0
# The markers a damaging shot can carry (feedback_adaptor.__getHitResultEventID, RU 1.45 client source): the others
# (ricochet, spaced armour, tracks, missed armour) come only with damageFactor 0. no_pen takes an HE splash.
DAMAGE_OUTCOMES = ('pen', 'crit', 'no_pen')
MAX_ENTRIES = 60

# How much a line tells: always the same (`alt_mode` off), or with `alt_mode` on the short line (outcome, damage, name)
# until Alt is held, then the full line with the class, HP left, shell and crits; Alt is the stock client's
# extended-info key (GameEvent.SHOW_EXTENDED_INFO, RU 1.45 client source).
DETAIL_FULL = 'full'
DETAIL_SHORT = 'short'
DETAIL_EXTENDED = 'extended'
# The line template per detail: (the setting with the player's own, the built-in one per shot, the built-in one
# grouped by target).
LINE_TEMPLATES = {
    DETAIL_FULL: ('line_template', 'hlog_line_template', 'hlog_target_template'),
    DETAIL_SHORT: ('line_template', 'hlog_line_template_short', 'hlog_target_template_short'),
    DETAIL_EXTENDED: ('alt_line_template', 'hlog_line_template_alt', 'hlog_target_template_alt'),
}

PREVIEW_HITS = (
    (1, 'Pz. IV', 'pen', 390, 'ap', 510),
    (2, 'T-34', 'ricochet', None, None, None),
    (3, 'KV-1', 'pen', 280, 'heat', 360),
)
PREVIEW_SIZE = (300, 110)
PREVIEW_CLASSES = {1: ('mediumTank', 900), 2: ('mediumTank', 1100), 3: ('heavyTank', 1500)}

KIND = 'hit_log'
# Colour roles of the outcomes (docs/specs/2026-09-29-hud-visual-redesign.md section 4.4).
OUTCOME_TONES = {'pen': 'success', 'crit': 'warning', 'no_pen': 'blocked', 'ricochet': 'blocked', 'spaced': 'blocked', 'tracks': 'track',
                 'missed_armor': 'muted'}

# {c_outcome} per palette, in OUTCOMES order: pen, crit, no_pen, ricochet, spaced, tracks, missed_armor. graphite is
# @otmetki/design-tokens, colorblind the Okabe-Ito set.
OUTCOME_COLORS = {
    'classic': ('#7CD35B', '#F2B25B', '#E3564A', '#A09A8B', '#9EC9F5', '#C8B26A', '#A09A8B'),
    'graphite': ('#FF7A1A', '#E8B84A', '#8EA4B5', '#A3A3AD', '#80A6CC', '#A9B56C', '#9797A0'),
    'contrast': ('#80FF40', '#FFD23F', '#FF4040', '#C0C0C0', '#40C0FF', '#FF9F40', '#C0C0C0'),
    'colorblind': ('#009E73', '#E69F00', '#D55E00', '#999999', '#56B4E9', '#F0E442', '#999999'),
}
