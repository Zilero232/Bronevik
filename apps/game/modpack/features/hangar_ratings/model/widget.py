# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import counted, format_number, format_percent
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_chip, card_row
from .constants import ACCOUNT_METRICS, CARD_WIDTH, METRIC_SEPARATOR, RATING_METRICS, SESSION_METRICS, STAR, TANK_METRICS, TIER_COLORS
from .panel import metric_enabled

# The hangar card: the account ratings as chips in their rating scale colours, then one row for the session and one for
# the selected tank (the headline rating right, the rest dimmed after it).


def rating_color(rating, colored):
    if not colored or not isinstance(rating, dict):
        return None
    return TIER_COLORS.get(rating.get('tier'))


def rating_value(rating):
    value = rating.get('value') if isinstance(rating, dict) else None
    return None if value is None else format_number(value)


def facts(row, metrics, settings, translate):
    parts = []
    if 'win_rate' in metrics and metric_enabled(settings, 'win_rate') and row.get('win_rate') is not None:
        parts.append(translate('hangar_ratings_win_rate_value', value=format_percent(row['win_rate'])))
    if 'battles' in metrics and metric_enabled(settings, 'battles'):
        parts.append(counted(row.get('battles') or 0, 'battles', translate))
    if 'avg_damage' in metrics and metric_enabled(settings, 'avg_damage') and row.get('avg_damage') is not None:
        parts.append(translate('hangar_ratings_avg_damage_value', value=format_number(row['avg_damage'])))
    if 'moe' in metrics and metric_enabled(settings, 'moe') and row.get('moe_percent') is not None:
        marks = STAR * (row.get('marks_on_gun') or 0)
        parts.append((format_percent(row['moe_percent']) + (u' ' + marks if marks else u'')))
    if 'mastery' in metrics and metric_enabled(settings, 'mastery') and row.get('mastery'):
        parts.append(translate('hangar_ratings_mastery_%d' % row['mastery']))
    return METRIC_SEPARATOR.join(parts) or None


def headline_row(label, row, metrics, settings, translate):
    colored = settings.get('colored')
    rating = row.get('wn8') if metric_enabled(settings, 'wn8') else None
    value = rating_value(rating)
    return card_row(None, value and u'WN8 ' + value, label=label, color=rating_color(rating, colored),
                    detail=facts(row, metrics, settings, translate))


def account_chips(overall, settings, translate):
    chips = []
    for metric in RATING_METRICS:
        rating = overall.get(metric)
        value = rating_value(rating)
        if metric_enabled(settings, metric) and value is not None:
            chips.append(card_chip(value, None, 'text', translate('hangar_ratings_short_' + metric), rating_color(rating, settings.get('colored'))))
    return chips


def ratings_widget(overview, tank, tank_label, settings, translate):
    chips, rows = [], []
    overall = overview.get('overall') if overview else None
    if settings.get('show_account') and overview is not None:
        if overall is None:
            rows.append(card_row(translate('hangar_ratings_no_data'), status='idle', text_tone='muted'))
        else:
            chips = account_chips(overall, settings, translate)
            detail = facts(overall, ACCOUNT_METRICS, settings, translate)
            if detail:
                rows.append(card_row(detail, text_tone='muted', label=translate('hangar_ratings_account_row')))
    session = overview.get('session') if overview else None
    if settings.get('show_session') and session and session.get('battles'):
        label = translate('hangar_ratings_session_live_row' if session.get('is_live') else 'hangar_ratings_session_last_row')
        rows.append(headline_row(label, session, SESSION_METRICS, settings, translate))
    if settings.get('show_tank') and tank is not None:
        rows.append(headline_row(tank_label or translate('hangar_ratings_tank_row'), tank, TANK_METRICS, settings, translate))
    if not chips and not rows:
        return None
    return card(translate('hangar_ratings_title'), glyph('wn8'), rows, chips=chips, rail='progress', width=CARD_WIDTH)
