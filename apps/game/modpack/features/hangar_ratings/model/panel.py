# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_number, format_percent
from .constants import (ACCOUNT_METRICS, ACTION_REFRESH, ACTION_SITE, METRIC_KEY, METRIC_SEPARATOR, RATING_METRICS, SESSION_METRICS, SITE_PATH, STAR,
                        TANK_METRICS, TIER_COLORS, TITLE_SIZE_STEP)


def metric_enabled(settings, metric):
    return bool(settings.get(METRIC_KEY % metric))


def tier_color(rating, colored):
    if not colored or not isinstance(rating, dict):
        return COLOR_NEUTRAL
    return TIER_COLORS.get(rating.get('tier'), COLOR_NEUTRAL)


def stars(marks):
    return STAR * marks if marks else u''


def _rating_text(metric, rating, translate, colored, size):
    value = rating.get('value') if isinstance(rating, dict) else None
    if value is None:
        return None
    return u'%s %s' % (font(translate('hangar_ratings_short_' + metric), COLOR_MUTED, size), font(format_number(value), tier_color(rating, colored), size))


def _moe_text(row, size):
    percent = row.get('moe_percent')
    if percent is None:
        return None
    text = format_percent(percent)
    marks = stars(row.get('marks_on_gun'))
    return font(u'%s %s' % (text, marks) if marks else text, COLOR_NEUTRAL, size)


def metric_text(metric, row, translate, colored, size):
    if metric in RATING_METRICS:
        return _rating_text(metric, row.get(metric), translate, colored, size)
    if metric == 'win_rate':
        value = row.get('win_rate')
        return None if value is None else font(translate('hangar_ratings_win_rate_value', value=format_percent(value)), COLOR_NEUTRAL, size)
    if metric == 'battles':
        return font(translate('hangar_ratings_battles_value', count=format_number(row.get('battles') or 0)), COLOR_NEUTRAL, size)
    if metric == 'avg_damage':
        value = row.get('avg_damage')
        return None if value is None else font(translate('hangar_ratings_avg_damage_value', value=format_number(value)), COLOR_NEUTRAL, size)
    if metric == 'moe':
        return _moe_text(row, size)
    if metric == 'mastery':
        mastery = row.get('mastery') or 0
        return font(translate('hangar_ratings_mastery_%d' % mastery), COLOR_NEUTRAL, size) if mastery else None
    return None


def metrics_line(label, row, metrics, settings, translate):
    size = settings.get('font_size')
    colored = settings.get('colored')
    parts = [metric_text(metric, row, translate, colored, size) for metric in metrics if metric_enabled(settings, metric)]
    parts = [part for part in parts if part]
    if not parts:
        return None
    return u'%s %s' % (font(label, COLOR_MUTED, size), METRIC_SEPARATOR.join(parts))


def _account_line(overview, settings, translate):
    if overview is None:
        return None
    if overview.get('overall') is None:
        return font(translate('hangar_ratings_no_data'), COLOR_MUTED, settings.get('font_size'))
    return metrics_line(translate('hangar_ratings_account'), overview['overall'], ACCOUNT_METRICS, settings, translate)


def _session_line(overview, settings, translate):
    session = overview.get('session') if overview else None
    if not session or not session.get('battles'):
        return None
    label = translate('hangar_ratings_session_live' if session.get('is_live') else 'hangar_ratings_session_last')
    return metrics_line(label, session, SESSION_METRICS, settings, translate)


def panel_text(overview, tank, tank_label, settings, translate):
    lines = []
    if settings.get('show_account'):
        lines.append(_account_line(overview, settings, translate))
    if settings.get('show_session'):
        lines.append(_session_line(overview, settings, translate))
    if settings.get('show_tank') and tank is not None:
        lines.append(metrics_line(tank_label or translate('hangar_ratings_tank'), tank, TANK_METRICS, settings, translate))
    lines = [line for line in lines if line]
    if not lines:
        return None
    title = font(translate('hangar_ratings_title'), COLOR_NEUTRAL, settings.get('font_size') + TITLE_SIZE_STEP)
    return u'\n'.join([title] + lines)


def layout_of(settings):
    return {'x': settings.get('x'), 'y': settings.get('y'), 'alignX': settings.get('align_x'), 'alignY': settings.get('align_y')}


def page_actions(translate):
    return [
        {'id': ACTION_REFRESH, 'label': translate('hangar_ratings_refresh'), 'confirm': None},
        {'id': ACTION_SITE, 'label': translate('hangar_ratings_site'), 'link': SITE_PATH, 'confirm': None},
    ]
