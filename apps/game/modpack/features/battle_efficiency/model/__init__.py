# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.battle_tally import Counters
from ....core.compat import is_number
from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number
from ....core.templates import render
from .constants import (
    DAMAGE_FLOOR,
    DEF_FLOOR,
    DEF_MARGIN,
    FRAG_FLOOR,
    FRAG_MARGIN,
    NEUTRAL_WIN_RATIO,
    SPOT_FLOOR,
    SPOT_MARGIN,
    WEIGHT_DAMAGE,
    WEIGHT_DAMAGE_FRAG,
    WEIGHT_DEF_FRAG,
    WEIGHT_FRAG_SPOT,
    WEIGHT_WIN,
    WIN_CAP,
    WIN_FLOOR,
)

# Fair play: this battle's own damage, spotting, frags and capture points reset (the player's feedback events) against
# the player's own averages on the tank and the tank's expected values from the site.

TOTALS = ('damage', 'spot', 'frag', 'def')


class BattleTotals(Counters):

    def __init__(self):
        Counters.__init__(self, TOTALS)


def _ratio(value, expected):
    if not is_number(expected) or expected <= 0:
        return 0.0
    return float(value) / expected


def _cut(ratio, floor):
    return max(0.0, (ratio - floor) / (1 - floor))


def _capped(key, totals, expected, floor, cap):
    ratio = _cut(_ratio(totals[key], expected[key]), floor)
    return max(0.0, min(cap, ratio))


def wn8(totals, expected, win_ratio=NEUTRAL_WIN_RATIO):
    if not expected:
        return None
    damage = _cut(_ratio(totals['damage'], expected['damage']), DAMAGE_FLOOR)
    frag = _capped('frag', totals, expected, FRAG_FLOOR, damage + FRAG_MARGIN)
    spot = _capped('spot', totals, expected, SPOT_FLOOR, damage + SPOT_MARGIN)
    defence = _capped('def', totals, expected, DEF_FLOOR, damage + DEF_MARGIN)
    win = min(WIN_CAP, _cut(win_ratio, WIN_FLOOR))

    score = (
        WEIGHT_DAMAGE * damage
        + WEIGHT_DAMAGE_FRAG * damage * frag
        + WEIGHT_FRAG_SPOT * frag * spot
        + WEIGHT_DEF_FRAG * defence * frag
        + WEIGHT_WIN * win
    )
    return int(round(score))


def _average(row):
    average = row.get('avg_damage')
    if is_number(average) and average > 0:
        return average
    return None


def _delta_percent(damage, average):
    if average is None:
        return None
    return int(round(100.0 * (damage - average) / average))


def panel_state(totals, row):
    row = row or {}
    average = _average(row)
    damage = totals['damage']
    return {
        'wn8': wn8(totals, row.get('expected')),
        'tank_wn8': (row.get('wn8') or {}).get('value'),
        'damage': damage,
        'average': average,
        'delta': _delta_percent(damage, average),
    }


def _color(value, reference, colored):
    if not colored or value is None or reference is None:
        return COLOR_NEUTRAL
    return COLOR_UP if value >= reference else COLOR_DOWN


def signed_percent(value):
    return (u'+%d%%' if value > 0 else u'%d%%') % value


def _template_text(state, settings, size):
    delta = signed_percent(state['delta']) if state['delta'] is not None else u''
    return font(render(settings.get('template'), dict(state, delta=delta)), COLOR_NEUTRAL, size)


def _wn8_line(state, translate, colored, size):
    color = _color(state['wn8'], state['tank_wn8'], colored)
    line = font(translate('eff_wn8', wn8=format_number(state['wn8'])), color, size)
    if state['tank_wn8'] is not None:
        tank_wn8 = translate('eff_tank_wn8', wn8=format_number(state['tank_wn8']))
        line += u' ' + font(tank_wn8, COLOR_MUTED, size)
    return line


def _damage_line(state, translate, colored, size):
    damage = translate('eff_damage', damage=format_number(state['damage']), average=format_number(state['average']))
    delta_color = _color(state['damage'], state['average'], colored)
    delta = font(u'(%s)' % signed_percent(state['delta']), delta_color, size)
    return font(damage, COLOR_NEUTRAL, size) + u' ' + delta


def format_panel(state, settings, translate):
    size = settings.get('font_size')
    colored = settings.get('colored')
    if settings.get('template'):
        return _template_text(state, settings, size)

    lines = []
    if settings.get('show_wn8') and state['wn8'] is not None:
        lines.append(_wn8_line(state, translate, colored, size))
    if settings.get('show_damage') and state['average'] is not None:
        lines.append(_damage_line(state, translate, colored, size))
    if not lines:
        return None
    return u'\n'.join(lines)
