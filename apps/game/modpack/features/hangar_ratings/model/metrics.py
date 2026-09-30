# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import counted, format_number, format_percent
from .constants import METRIC_KEY, STAR, TIER_COLORS

# One metric of a row as plain text, shared by the text panel (model/panel.py) and the hangar card (model/widget.py).


def metric_enabled(settings, metric):
    return bool(settings.get(METRIC_KEY % metric))


def rating_color(rating, is_colored):
    if not is_colored or not isinstance(rating, dict):
        return None
    return TIER_COLORS.get(rating.get('tier'))


def rating_value(rating):
    if not isinstance(rating, dict):
        return None
    value = rating.get('value')
    if value is None:
        return None
    return format_number(value)


def _win_rate_text(row, translate):
    win_rate = row.get('win_rate')
    if win_rate is None:
        return None
    return translate('hangar_ratings_win_rate_value', value=format_percent(win_rate))


def _battles_text(row, translate):
    return counted(row.get('battles') or 0, 'battles', translate)


def _avg_damage_text(row, translate):
    avg_damage = row.get('avg_damage')
    if avg_damage is None:
        return None
    return translate('hangar_ratings_avg_damage_value', value=format_number(avg_damage))


def _moe_text(row, translate):
    percent = row.get('moe_percent')
    if percent is None:
        return None
    text = format_percent(percent)
    marks = row.get('marks_on_gun')
    if not marks:
        return text
    return u'%s %s' % (text, STAR * marks)


def _mastery_text(row, translate):
    mastery = row.get('mastery')
    if not mastery:
        return None
    return translate('hangar_ratings_mastery_%d' % mastery)


FACT_TEXTS = {
    'win_rate': _win_rate_text,
    'battles': _battles_text,
    'avg_damage': _avg_damage_text,
    'moe': _moe_text,
    'mastery': _mastery_text,
}


def fact_text(metric, row, translate):
    text_of = FACT_TEXTS.get(metric)
    if text_of is None:
        return None
    return text_of(row, translate)
