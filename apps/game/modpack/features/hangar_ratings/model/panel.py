# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font
from .constants import (
    ACCOUNT_METRICS,
    ACTION_REFRESH,
    ACTION_SITE,
    METRIC_SEPARATOR,
    RATING_METRICS,
    SESSION_METRICS,
    SITE_PATH,
    TANK_METRICS,
    TITLE_SIZE_STEP,
)
from .metrics import fact_text, metric_enabled, rating_color, rating_value


def _rating_text(metric, rating, translate, is_colored, size):
    value = rating_value(rating)
    if value is None:
        return None
    name = font(translate('hangar_ratings_short_' + metric), COLOR_MUTED, size)
    color = rating_color(rating, is_colored) or COLOR_NEUTRAL
    return u'%s %s' % (name, font(value, color, size))


def metric_text(metric, row, translate, is_colored, size):
    if metric in RATING_METRICS:
        return _rating_text(metric, row.get(metric), translate, is_colored, size)
    text = fact_text(metric, row, translate)
    if text is None:
        return None
    return font(text, COLOR_NEUTRAL, size)


def metrics_line(label, row, metrics, settings, translate):
    size = settings.get('font_size')
    is_colored = settings.get('colored')
    enabled = [metric for metric in metrics if metric_enabled(settings, metric)]

    texts = [metric_text(metric, row, translate, is_colored, size) for metric in enabled]
    parts = [text for text in texts if text]
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


def _tank_line(tank, tank_label, settings, translate):
    label = tank_label or translate('hangar_ratings_tank')
    return metrics_line(label, tank, TANK_METRICS, settings, translate)


def panel_text(overview, tank, tank_label, settings, translate):
    lines = []
    if settings.get('show_account'):
        lines.append(_account_line(overview, settings, translate))
    if settings.get('show_session'):
        lines.append(_session_line(overview, settings, translate))
    if settings.get('show_tank') and tank is not None:
        lines.append(_tank_line(tank, tank_label, settings, translate))

    lines = [line for line in lines if line]
    if not lines:
        return None

    title = font(translate('hangar_ratings_title'), COLOR_NEUTRAL, settings.get('font_size') + TITLE_SIZE_STEP)
    return u'\n'.join([title] + lines)


def layout_of(settings):
    return {
        'x': settings.get('x'),
        'y': settings.get('y'),
        'alignX': settings.get('align_x'),
        'alignY': settings.get('align_y'),
    }


def page_actions(translate):
    return [
        {'id': ACTION_REFRESH, 'label': translate('hangar_ratings_refresh'), 'confirm': None},
        {'id': ACTION_SITE, 'label': translate('hangar_ratings_site'), 'link': SITE_PATH, 'confirm': None},
    ]
