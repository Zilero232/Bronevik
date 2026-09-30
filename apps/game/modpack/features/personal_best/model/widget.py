# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_number
from ....core.hud.icons import efficiency_icon, glyph
from ....core.hud.widget import card, card_row
from . import metric_values
from .constants import CARD_WIDTH, LIVE_METRICS, METRIC_ICONS


def metric_row(metric, record, live, translate):
    values = metric_values(metric, record, live.values.get(metric, 0), translate)
    icon = efficiency_icon(METRIC_ICONS[metric])
    if values['over'] > 0:
        return card_row(values['metric'], format_number(values['current']), icon=icon, status='honors', tone_name='gold',
                        note=u'+' + format_number(values['over']), progress=1.0, progress_tone='gold')
    progress = float(values['current']) / values['record'] if values['record'] else None
    return card_row(values['metric'], format_number(values['record']), icon=icon, note=translate('pb_row_left', left=format_number(values['left'])),
                    progress=progress, progress_tone='gold', text_tone='muted')


def line_widget(record, live, settings, translate):
    if settings.get('template'):
        return None
    rows = [metric_row(metric, record, live, translate) for metric in LIVE_METRICS if settings.get('show_' + metric) and record.get(metric)]
    if not rows:
        return None
    return card(translate('pb_card_title'), glyph('record'), rows, rail='progress', width=CARD_WIDTH)
