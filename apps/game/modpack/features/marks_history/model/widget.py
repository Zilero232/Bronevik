# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import counted, format_number
from ....core.hud.icons import glyph, mark_icon
from ....core.hud.widget import card, card_row
from .constants import CARD_WIDTH
from .page import signed_percent

# The hangar card of the selected tank: the percent big on the right, the last battle's change and the trend over the
# last battles as rows with an up or down arrow.


def delta_row(label, value):
    if value is None:
        return None
    tone = 'good' if value > 0 else ('bad' if value < 0 else 'muted')
    icon = glyph('trend_up') if value > 0 else (glyph('trend_down') if value < 0 else glyph('dot'))
    return card_row(label, signed_percent(value), icon=icon, tone_name=tone, text_tone='muted')


def hangar_widget(summary, translate):
    value = u'%.2f%%' % summary['percent'] if summary['percent'] is not None else None
    rows = [delta_row(translate('marks_history_last_row'), summary.get('last_delta'))]
    if summary.get('trend_battles', 0) > 1:
        rows.append(delta_row(translate('marks_history_trend_row', battles=counted(summary['trend_battles'], 'battles', translate)),
                              summary.get('trend')))
    footer = translate('marks_history_avg', avg=format_number(summary['avg'])) if summary.get('avg') else None
    return card(translate('marks_history_title'), mark_icon(summary.get('marks')) or glyph('trend_up'), rows, value=value,
                subtitle=summary.get('label') or None, footer=footer, rail='progress', width=CARD_WIDTH)
