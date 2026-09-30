# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import counted, format_number
from ....core.hud.icons import glyph, mark_icon
from ....core.hud.widget import card, card_row
from .constants import CARD_WIDTH, DELTA_GLYPHS, DELTA_TONES
from .page import delta_sign, percent_text, signed_percent

# The hangar card of the selected tank: the percent big on the right, the last battle's change and the trend over the
# last battles as rows with an up or down arrow.


def delta_row(label, value):
    if value is None:
        return None
    sign = delta_sign(value)
    icon = glyph(DELTA_GLYPHS[sign])
    return card_row(label, signed_percent(value), icon=icon, tone_name=DELTA_TONES[sign], text_tone='muted')


def _trend_row(summary, translate):
    battles = counted(summary['trend_battles'], 'battles', translate)
    return delta_row(translate('marks_history_trend_row', battles=battles), summary.get('trend'))


def hangar_widget(summary, translate):
    rows = [delta_row(translate('marks_history_last_row'), summary.get('last_delta'))]
    if summary.get('trend_battles', 0) > 1:
        rows.append(_trend_row(summary, translate))
    footer = None
    if summary.get('avg'):
        footer = translate('marks_history_avg', avg=format_number(summary['avg']))

    return card(
        translate('marks_history_title'),
        mark_icon(summary.get('marks')) or glyph('trend_up'),
        rows,
        value=percent_text(summary['percent']),
        subtitle=summary.get('label') or None,
        footer=footer,
        rail='progress',
        width=CARD_WIDTH,
    )
