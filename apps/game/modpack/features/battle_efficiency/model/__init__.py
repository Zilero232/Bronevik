# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.battle_tally import Counters
from ....core.compat import is_number
from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number
from ....core.templates import render
from .constants import (DAMAGE_FLOOR, DEF_FLOOR, DEF_MARGIN, FRAG_FLOOR, FRAG_MARGIN, NEUTRAL_WIN_RATIO, SPOT_FLOOR, SPOT_MARGIN, WEIGHT_DAMAGE,
                        WEIGHT_DAMAGE_FRAG, WEIGHT_DEF_FRAG, WEIGHT_FRAG_SPOT, WEIGHT_WIN, WIN_CAP, WIN_FLOOR)

# Fair play: this battle's own damage, spotting, frags and capture points reset (the player's feedback events) against
# the player's own averages on the tank and the tank's expected values from the site.

TOTALS = ('damage', 'spot', 'frag', 'def')


class BattleTotals(Counters):

    def __init__(self):
        Counters.__init__(self, TOTALS)


def _ratio(value, expected):
    return float(value) / expected if is_number(expected) and expected > 0 else 0.0


def _cut(ratio, floor):
    return max(0.0, (ratio - floor) / (1 - floor))


def wn8(totals, expected, win_ratio=NEUTRAL_WIN_RATIO):
    if not expected:
        return None
    damage = _cut(_ratio(totals['damage'], expected['damage']), DAMAGE_FLOOR)
    frag = max(0.0, min(damage + FRAG_MARGIN, _cut(_ratio(totals['frag'], expected['frag']), FRAG_FLOOR)))
    spot = max(0.0, min(damage + SPOT_MARGIN, _cut(_ratio(totals['spot'], expected['spot']), SPOT_FLOOR)))
    defence = max(0.0, min(damage + DEF_MARGIN, _cut(_ratio(totals['def'], expected['def']), DEF_FLOOR)))
    win = _cut(win_ratio, WIN_FLOOR)
    return int(round(WEIGHT_DAMAGE * damage + WEIGHT_DAMAGE_FRAG * damage * frag + WEIGHT_FRAG_SPOT * frag * spot
                     + WEIGHT_DEF_FRAG * defence * frag + WEIGHT_WIN * min(WIN_CAP, win)))


def panel_state(totals, row):
    row = row or {}
    average = row.get('avg_damage') if is_number(row.get('avg_damage')) and row.get('avg_damage') > 0 else None
    own_wn8 = (row.get('wn8') or {}).get('value')
    damage = totals['damage']
    return {
        'wn8': wn8(totals, row.get('expected')),
        'tank_wn8': own_wn8,
        'damage': damage,
        'average': average,
        'delta': int(round(100.0 * (damage - average) / average)) if average is not None else None,
    }


def _color(value, reference, colored):
    if not colored or value is None or reference is None:
        return COLOR_NEUTRAL
    return COLOR_UP if value >= reference else COLOR_DOWN


def _signed(value):
    return (u'+%d%%' if value > 0 else u'%d%%') % value


def format_panel(state, settings, translate):
    size = settings.get('font_size')
    colored = settings.get('colored')
    if settings.get('template'):
        values = dict(state, delta=_signed(state['delta']) if state['delta'] is not None else u'')
        return font(render(settings.get('template'), values), COLOR_NEUTRAL, size)
    lines = []
    if settings.get('show_wn8') and state['wn8'] is not None:
        line = font(translate('eff_wn8', wn8=format_number(state['wn8'])), _color(state['wn8'], state['tank_wn8'], colored), size)
        if state['tank_wn8'] is not None:
            line += u' ' + font(translate('eff_tank_wn8', wn8=format_number(state['tank_wn8'])), COLOR_MUTED, size)
        lines.append(line)
    if settings.get('show_damage') and state['average'] is not None:
        line = font(translate('eff_damage', damage=format_number(state['damage']), average=format_number(state['average'])), COLOR_NEUTRAL, size)
        line += u' ' + font(u'(%s)' % _signed(state['delta']), _color(state['damage'], state['average'], colored), size)
        lines.append(line)
    return u'\n'.join(lines) if lines else None
