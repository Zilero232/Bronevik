# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.format import counted, format_number, format_percent
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_chip, card_row
from .constants import CARD_WIDTH, EVEN_WIN_RATE, RESULT_TONES


def win_rate_tone(value):
    if not is_number(value):
        return 'muted'
    return 'good' if value >= EVEN_WIN_RATE else 'bad'


def pending_rows(pending, translate):
    if not pending:
        return ()

    return (card_row(translate('session_pending', count=pending), status='idle', text_tone='muted'),)


def session_chips(summary, translate):
    win_rate = summary.get('win_rate')
    chips = [
        card_chip(format_percent(win_rate), glyph('points'), win_rate_tone(win_rate), translate('session_winrate')),
        card_chip(format_number(summary.get('avg_damage')), glyph('damage'), 'text', translate('session_damage')),
    ]

    wn8 = summary.get('wn8')
    if is_number(wn8):
        chips.append(card_chip(format_number(wn8), glyph('wn8'), 'accent', translate('session_wn8')))

    return chips


def session_widget(summary, translate):
    footer = translate(
        'session_record',
        wins=summary.get('wins') or 0,
        losses=summary.get('losses') or 0,
        draws=summary.get('draws') or 0,
    )
    strip = [RESULT_TONES[result] for result in summary.get('recent') or ()]

    return card(
        translate('session_title'),
        glyph('session'),
        pending_rows(summary.get('pending'), translate),
        value=counted(summary.get('battles') or 0, 'battles', translate),
        chips=session_chips(summary, translate),
        footer=footer,
        rail='progress',
        width=CARD_WIDTH,
        strip=strip,
    )
