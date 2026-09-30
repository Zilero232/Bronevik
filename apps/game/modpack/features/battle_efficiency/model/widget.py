# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_number
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from . import signed_percent
from .constants import CARD_WIDTH


def _tone(value, reference, colored):
    if not colored or value is None or reference is None:
        return 'text'
    return 'good' if value >= reference else 'bad'


def _tank_row(state, translate):
    return card_row(
        translate('eff_row_tank'),
        format_number(state['tank_wn8']),
        icon=glyph('wn8'),
        text_tone='muted',
        tone_name='muted',
    )


def _damage_row(state, translate, colored):
    return card_row(
        translate('eff_row_damage', average=format_number(state['average'])),
        format_number(state['damage']),
        icon=glyph('damage'),
        note=signed_percent(state['delta']),
        tone_name=_tone(state['damage'], state['average'], colored),
        text_tone='muted',
    )


def panel_widget(state, settings, translate):
    if settings.get('template'):
        return None
    colored = settings.get('colored')
    shows_wn8 = settings.get('show_wn8') and state['wn8'] is not None

    rows = []
    if shows_wn8 and state['tank_wn8'] is not None:
        rows.append(_tank_row(state, translate))
    if settings.get('show_damage') and state['average'] is not None:
        rows.append(_damage_row(state, translate, colored))
    if not shows_wn8 and not rows:
        return None

    return card(
        translate('eff_card_title'),
        glyph('wn8'),
        rows,
        value=u'~' + format_number(state['wn8']) if shows_wn8 else None,
        value_tone=_tone(state['wn8'], state['tank_wn8'], colored) if shows_wn8 else 'text',
        rail='progress',
        width=CARD_WIDTH,
    )
