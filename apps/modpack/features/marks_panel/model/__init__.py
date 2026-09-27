# -*- coding: utf-8 -*-
"""MoE maths (EMA, threshold curve, projection) and the in-battle panel text. Pure, Python 2/3."""
import math

from ....core.compat import is_number
from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number, format_percent

EMA_WINDOW = 100
EMA_K = 2.0 / (EMA_WINDOW + 1)
MARK_LEVELS = (65.0, 85.0, 95.0)


def combined_damage(damage, radio, track, stun):
    return damage + max(radio, track, stun)


def project_moving_avg(moving_avg, battle_combined):
    return EMA_K * battle_combined + (1.0 - EMA_K) * moving_avg


def required_battle_damage(moving_avg, target_avg):
    return max(0.0, (target_avg - (1.0 - EMA_K) * moving_avg) / EMA_K)


def rating_to_percent(damage_rating):
    return round(damage_rating / 100.0, 2)


class BattleTotals(object):

    KINDS = ('damage', 'radio', 'track', 'stun')

    def __init__(self):
        self.damage = 0
        self.radio = 0
        self.track = 0
        self.stun = 0

    def add(self, kind, amount):
        if kind not in self.KINDS or not is_number(amount) or amount <= 0:
            return False
        setattr(self, kind, getattr(self, kind) + amount)
        return True

    def combined(self):
        return combined_damage(self.damage, self.radio, self.track, self.stun)


class ThresholdCurve(object):

    def __init__(self, points):
        cleaned = {}
        for percent, damage in points:
            if is_number(percent) and is_number(damage) and 0.0 <= percent <= 100.0 and damage >= 0:
                cleaned[float(percent)] = float(damage)
        cleaned[0.0] = 0.0
        ordered = sorted(cleaned.items())
        monotonic = []
        for percent, damage in ordered:
            if monotonic and damage <= monotonic[-1][1]:
                continue
            monotonic.append((percent, damage))
        self.points = monotonic

    def is_usable(self):
        return len(self.points) >= 2

    @property
    def max_percent(self):
        return self.points[-1][0]

    @classmethod
    def from_api(cls, data):
        if not isinstance(data, dict):
            return None
        points = []
        thresholds = data.get('thresholds')
        if isinstance(thresholds, dict):
            for key, value in thresholds.items():
                try:
                    points.append((float(key), value))
                except (TypeError, ValueError):
                    continue
        curve = data.get('curve')
        if isinstance(curve, list):
            for entry in curve:
                if isinstance(entry, dict):
                    points.append((entry.get('percent'), entry.get('damage')))
        result = cls(points)
        return result if result.is_usable() else None

    def percent_for(self, avg):
        if avg <= 0:
            return 0.0
        for index in range(1, len(self.points)):
            p0, d0 = self.points[index - 1]
            p1, d1 = self.points[index]
            if avg <= d1:
                return p0 + (avg - d0) * (p1 - p0) / (d1 - d0)
        return self.max_percent

    def damage_for(self, percent):
        if percent < 0 or percent > self.max_percent:
            return None
        for index in range(1, len(self.points)):
            p0, d0 = self.points[index - 1]
            p1, d1 = self.points[index]
            if percent <= p1:
                return d0 + (percent - p0) * (d1 - d0) / (p1 - p0)
        return self.points[-1][1]


def next_level(current_percent, curve, levels=MARK_LEVELS):
    for level in levels:
        if level > current_percent and level <= curve.max_percent:
            return level
    return None


def project(moving_avg, current_percent, totals, curve, levels=MARK_LEVELS):
    combined = totals.combined()
    projected_avg = project_moving_avg(moving_avg, combined)
    result = {
        'current_percent': current_percent,
        'combined_damage': int(combined),
        'projected_avg': int(round(projected_avg)),
        'projected_percent': None,
        'target_level': None,
        'target_avg': None,
        'damage_needed': None,
        'damage_remaining': None,
    }
    if curve is None:
        return result
    result['projected_percent'] = round(curve.percent_for(projected_avg), 2)
    base_percent = current_percent if is_number(current_percent) else curve.percent_for(moving_avg)
    level = next_level(base_percent, curve, levels)
    if level is None:
        return result
    target_avg = curve.damage_for(level)
    needed = required_battle_damage(moving_avg, target_avg)
    result['target_level'] = level
    result['target_avg'] = int(round(target_avg))
    result['damage_needed'] = int(math.ceil(needed))
    result['damage_remaining'] = max(0, int(math.ceil(needed - combined)))
    return result


def format_moe_panel(projection, translate):
    current = projection.get('current_percent')
    projected = projection.get('projected_percent')
    lines = []
    head = u'%s %s' % (translate('moe_title'), format_percent(current))
    lines.append(font(head, COLOR_NEUTRAL, 16))
    if projected is None:
        lines.append(font(translate('moe_no_thresholds'), COLOR_MUTED))
    else:
        color = COLOR_UP if not is_number(current) or projected >= current else COLOR_DOWN
        lines.append(font(u'%s: %s' % (translate('moe_projected'), format_percent(projected)), color, 14))
    level = projection.get('target_level')
    remaining = projection.get('damage_remaining')
    if level is not None and remaining is not None:
        level_text = u'%d' % int(level)
        if remaining <= 0:
            lines.append(font(translate('moe_reached', level=level_text), COLOR_UP))
        else:
            lines.append(font(translate('moe_need', level=level_text, damage=format_number(remaining)), COLOR_NEUTRAL))
    elif projected is not None:
        lines.append(font(translate('moe_max'), COLOR_MUTED))
    return u'\n'.join(lines)
