# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_number
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from .constants import CARD_WIDTH


def _tone(value, reference, colored):
    if not colored or value is None or reference is None:
        return 'text'
    return 'good' if value >= reference else 'bad'


def _signed(value):
    return (u'+%d%%' if value > 0 else u'%d%%') % value


def panel_widget(state, settings, translate):
    if settings.get('template'):
        return None
    colored = settings.get('colored')
    rows = []
    value, value_tone = None, 'text'
    if settings.get('show_wn8') and state['wn8'] is not None:
        value = u'~' + format_number(state['wn8'])
        value_tone = _tone(state['wn8'], state['tank_wn8'], colored)
        if state['tank_wn8'] is not None:
            rows.append(card_row(translate('eff_row_tank'), format_number(state['tank_wn8']), icon=glyph('wn8'), text_tone='muted', tone_name='muted'))
    if settings.get('show_damage') and state['average'] is not None:
        rows.append(card_row(translate('eff_row_damage', average=format_number(state['average'])), format_number(state['damage']),
                             icon=glyph('damage'), note=_signed(state['delta']), tone_name=_tone(state['damage'], state['average'], colored),
                             text_tone='muted'))
    if value is None and not rows:
        return None
    return card(translate('eff_card_title'), glyph('wn8'), rows, value=value, value_tone=value_tone, rail='progress', width=CARD_WIDTH)
