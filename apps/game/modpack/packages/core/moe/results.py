from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import is_int, is_number
from .constants import MAX_BATTLE_CHANGE, MAX_RATING, RATING_SCALE, RESULTS_ROUNDING


# RU 1.45 client source: the battle results carry `damageRating` as a whole percent (common/battle_results/
# battle_results_common.py: VEHICLE_SELF 'damageRating', int), and the dossier updater stores it times 100
# (common/dossiers2/custom/battle_results_processors.py __updateMarksOnGun: int(results['damageRating'] * 100)); the
# dossier's own damageRating is hundredths of a percent (6647 = 66.47 %). Read raw, 67 would be 0.67 %.
def results_rating(value):
    if not is_number(value) or value <= 0:
        return None
    return int(round(value * RATING_SCALE))


def is_rating(value):
    return is_int(value) and 0 < value <= MAX_RATING


# The hangar's dossier read after the battle: the same moving average as the results and a rating the results' whole
# percent rounds to. It holds the exact hundredths the results lack.
def is_post_battle_reading(moe, snapshot):
    if not isinstance(moe, dict) or not isinstance(snapshot, dict):
        return False
    if snapshot.get('moving_avg_damage') != moe.get('moving_avg_damage'):
        return False
    if not (is_rating(snapshot.get('damage_rating')) and is_rating(moe.get('damage_rating'))):
        return False
    return abs(snapshot['damage_rating'] - moe['damage_rating']) <= RESULTS_ROUNDING


def exact_moe(moe, snapshot):
    """The battle results' MoE block with the hangar's exact rating once the hangar holds the post-battle reading."""
    if not is_post_battle_reading(moe, snapshot):
        return moe
    exact = dict(moe)
    exact['damage_rating'] = snapshot['damage_rating']
    return exact


def implausible_change(before, after):
    """Why a battle's rating change cannot be real (a value outside 0..100 %, or more than MAX_BATTLE_CHANGE in one
    battle), None when it can."""
    if not is_rating(after):
        return 'rating %r is outside 0..100 %%' % (after,)
    if is_rating(before) and abs(after - before) > MAX_BATTLE_CHANGE:
        limit = MAX_BATTLE_CHANGE // RATING_SCALE
        return 'rating %d after %d moved more than %d %% in one battle' % (after, before, limit)
    return None
