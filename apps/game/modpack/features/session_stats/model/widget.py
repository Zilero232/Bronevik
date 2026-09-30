# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.format import counted, format_number, format_percent
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_chip
from .constants import CARD_WIDTH, EVEN_WIN_RATE


def win_rate_tone(value):
    if not is_number(value):
        return 'muted'
    return 'good' if value >= EVEN_WIN_RATE else 'bad'


def session_widget(summary, translate):
    chips = [
        card_chip(format_percent(summary.get('win_rate')), glyph('points'), win_rate_tone(summary.get('win_rate')), translate('session_winrate')),
        card_chip(format_number(summary.get('avg_damage')), glyph('damage'), 'text', translate('session_damage')),
    ]
    if is_number(summary.get('wn8')):
        chips.append(card_chip(format_number(summary['wn8']), glyph('wn8'), 'accent', translate('session_wn8')))
    footer = translate('session_record', wins=summary.get('wins') or 0, losses=summary.get('losses') or 0, draws=summary.get('draws') or 0)
    return card(translate('session_title'), glyph('session'), (), value=counted(summary.get('battles') or 0, 'battles', translate), chips=chips,
                footer=footer, rail='progress', width=CARD_WIDTH)
