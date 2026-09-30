# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_number
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from . import shown_numbers
from .constants import CARD_WIDTH, STATE_LOOKS


def threshold_row(state, translate):
    look = STATE_LOOKS[state['status']]
    need = state['need']
    progress = min(1.0, float(state['damage']) / need) if need else None
    note = translate(look['note'], **shown_numbers(state)) if look['note'] else None

    return card_row(translate('main_gun_row_threshold'), format_number(need), status=look['status'],
                    tone_name=look['tone'], progress=progress, progress_tone=look['tone'], note=note,
                    text_tone='muted')


def team_row(state, translate):
    label = translate('main_gun_row_team', team=format_number(state['team']))
    return card_row(label, u'%d%%' % state['share'], icon=glyph('platoon'), text_tone='muted')


def panel_widget(state, settings, translate):
    if settings.get('template'):
        return None

    rows = [threshold_row(state, translate)]
    if settings.get('show_team'):
        rows.append(team_row(state, translate))

    look = STATE_LOOKS[state['status']]
    return card(translate('main_gun_card_title'), glyph('target'), rows, value=format_number(state['damage']),
                value_tone=look['tone'], rail='progress', width=CARD_WIDTH)
