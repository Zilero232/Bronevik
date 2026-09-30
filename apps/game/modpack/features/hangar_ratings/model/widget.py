# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_chip, card_row
from .constants import ACCOUNT_METRICS, CARD_WIDTH, METRIC_SEPARATOR, RATING_METRICS, SESSION_METRICS, TANK_METRICS
from .metrics import fact_text, metric_enabled, rating_color, rating_value

# The hangar card: the account ratings as chips in their rating scale colours, then one row for the session and one for
# the selected tank (the headline rating right, the rest dimmed after it).


def facts(row, metrics, settings, translate):
    enabled = [metric for metric in metrics if metric_enabled(settings, metric)]
    texts = [fact_text(metric, row, translate) for metric in enabled]
    parts = [text for text in texts if text]
    return METRIC_SEPARATOR.join(parts) or None


def headline_row(label, row, metrics, settings, translate):
    rating = row.get('wn8') if metric_enabled(settings, 'wn8') else None
    value = rating_value(rating)
    headline = None if value is None else u'WN8 ' + value
    return card_row(
        None,
        headline,
        label=label,
        color=rating_color(rating, settings.get('colored')),
        detail=facts(row, metrics, settings, translate),
    )


def account_chips(overall, settings, translate):
    chips = []
    for metric in RATING_METRICS:
        rating = overall.get(metric)
        value = rating_value(rating)
        if not metric_enabled(settings, metric) or value is None:
            continue
        label = translate('hangar_ratings_short_' + metric)
        chips.append(card_chip(value, None, 'text', label, rating_color(rating, settings.get('colored'))))
    return chips


def _account_rows(overall, settings, translate):
    if overall is None:
        return [card_row(translate('hangar_ratings_no_data'), status='idle', text_tone='muted')]
    detail = facts(overall, ACCOUNT_METRICS, settings, translate)
    if not detail:
        return []
    return [card_row(detail, text_tone='muted', label=translate('hangar_ratings_account_row'))]


def _session_row(session, settings, translate):
    is_live = session.get('is_live')
    label = translate('hangar_ratings_session_live_row' if is_live else 'hangar_ratings_session_last_row')
    return headline_row(label, session, SESSION_METRICS, settings, translate)


def _tank_row(tank, tank_label, settings, translate):
    label = tank_label or translate('hangar_ratings_tank_row')
    return headline_row(label, tank, TANK_METRICS, settings, translate)


def ratings_widget(overview, tank, tank_label, settings, translate):
    chips, rows = [], []
    overall = overview.get('overall') if overview else None
    session = overview.get('session') if overview else None

    if settings.get('show_account') and overview is not None:
        rows.extend(_account_rows(overall, settings, translate))
        if overall is not None:
            chips = account_chips(overall, settings, translate)
    if settings.get('show_session') and session and session.get('battles'):
        rows.append(_session_row(session, settings, translate))
    if settings.get('show_tank') and tank is not None:
        rows.append(_tank_row(tank, tank_label, settings, translate))

    if not chips and not rows:
        return None
    return card(translate('hangar_ratings_title'), glyph('wn8'), rows, chips=chips, rail='progress', width=CARD_WIDTH)
