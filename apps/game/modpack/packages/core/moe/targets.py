from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ..compat import is_number
from .constants import MARK_LEVELS, MAX_PERCENT, TARGET_LEVELS
from .curve import next_level
from .ema import battles_to_reach, project_moving_avg, required_battle_damage


def _remaining(moving_avg, target_avg, combined):
    return max(0, int(math.ceil(required_battle_damage(moving_avg, target_avg) - combined - 1e-9)))


def _clamp_percent(value):
    return round(min(MAX_PERCENT, max(0.0, value)), 2)


def moe_state(moving_avg, percent, combined=None, curve=None, pace=None, step=0.5, marks=None, levels=MARK_LEVELS):
    """Everything a marks view shows about one tank, from the dossier at battle start (`moving_avg`,
    `percent`, `marks`), the combined damage dealt so far in this battle, the site curve and the pace.

    The projection keeps the dossier's percent and adds the curve's change (the curve and the dossier
    can disagree a little; the change is what the player earns in this battle). `need` holds, per target
    level, the combined damage still needed in this battle (0 once it is reached); `target_avg` the EMA each
    level needs. `step_need` is the damage for +`step` percent, `battles` the forecast at `pace` to the next
    mark after this battle. Outside a battle (`combined` None) nothing is projected and the needs are
    those of the next battle."""
    in_battle = is_number(combined)
    combined = max(0, int(combined)) if in_battle else 0
    projected_avg = project_moving_avg(moving_avg, combined) if in_battle else float(moving_avg)
    state = {
        'percent': percent if is_number(percent) else None,
        'marks': marks if is_number(marks) else None,
        'damage': combined,
        'ema': int(round(moving_avg)),
        'ema_projected': int(round(projected_avg)),
        'projected': None,
        'delta': None,
        'next_level': None,
        'need_next': None,
        'need': {},
        'target_avg': {},
        'step': step,
        'step_need': None,
        'pace': int(round(pace)) if is_number(pace) else None,
        'battles': None,
        'has_curve': curve is not None,
    }
    if curve is None:
        return state
    start_curve = curve.percent_for(moving_avg)
    base = percent if is_number(percent) else start_curve
    delta = curve.percent_for(projected_avg) - start_curve
    state['projected'] = _clamp_percent(base + delta)
    state['delta'] = round(state['projected'] - round(base, 2), 2)
    for level in TARGET_LEVELS:
        target_avg = curve.damage_for(level)
        if target_avg is None:
            continue
        state['target_avg'][int(level)] = int(round(target_avg))
        state['need'][int(level)] = 0 if base >= level else _remaining(moving_avg, target_avg, combined)
    level = next_level(base, curve, levels)
    if level is not None:
        state['next_level'] = int(level)
        state['need_next'] = state['need'].get(int(level))
        state['battles'] = battles_to_reach(projected_avg, curve.damage_for(level), pace)
    if is_number(step) and step > 0:
        step_avg = curve.damage_for(min(curve.max_percent, start_curve + step))
        if step_avg is not None and start_curve + step <= curve.max_percent:
            state['step_need'] = _remaining(moving_avg, step_avg, combined)
    return state
