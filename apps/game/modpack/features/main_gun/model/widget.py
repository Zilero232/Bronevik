# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_number
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from .constants import CARD_WIDTH


def panel_widget(state, settings, translate):
    if settings.get('template'):
        return None
    need = state['need']
    progress = min(1.0, float(state['damage']) / need) if need else None
    if state['reached']:
        threshold = card_row(translate('main_gun_row_threshold'), format_number(need), status='done', tone_name='success', progress=1.0,
                             progress_tone='success', text_tone='muted')
    else:
        threshold = card_row(translate('main_gun_row_threshold'), format_number(need), status='active', progress=progress, progress_tone='gold',
                             note=translate('main_gun_row_left', left=format_number(state['left'])), text_tone='muted')
    rows = [threshold]
    if settings.get('show_team'):
        rows.append(card_row(translate('main_gun_row_team', team=format_number(state['team'])), u'%d%%' % state['share'], icon=glyph('platoon'),
                             text_tone='muted'))
    return card(translate('main_gun_card_title'), glyph('target'), rows, value=format_number(state['damage']),
                value_tone='success' if state['reached'] else 'gold', rail='progress', width=CARD_WIDTH)
