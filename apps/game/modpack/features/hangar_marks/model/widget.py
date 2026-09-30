# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.format import counted, format_number
from ....core.hud.icons import glyph, mark_icon
from ....core.hud.widget import card, card_chip, card_row
from ....core.moe import moe_macros
from .constants import CARD_WIDTH, PERCENT_SUFFIX, TONE_BY_MARKS

# Fair play: the player's own marks of excellence of the selected tank (own dossier, own average and pace).


def percent_tone(state):
    marks = state['marks'] if is_number(state['marks']) else 0
    return TONE_BY_MARKS[max(0, min(int(marks), len(TONE_BY_MARKS) - 1))]


def target_rows(state, translate):
    rows = []
    for level in sorted(state['need']):
        if level == 100 and state['next_level'] != 100:
            continue
        need = state['need'][level]
        done = is_number(need) and need <= 0
        status = 'done' if done else ('active' if level == state['next_level'] else 'idle')
        rows.append(card_row(None, translate('hangar_marks_reached') if done else format_number(need), label=u'%d%s' % (level, PERCENT_SUFFIX),
                             status=status, tone_name='success' if done else 'text',
                             note=None if done else translate('hangar_marks_per_battle')))
    return rows


def extra_rows(state, settings, translate, values):
    rows = []
    if settings.get('show_forecast') and state['next_level'] is not None and state['battles'] is not None:
        rows.append(card_row(translate('hangar_marks_forecast', next=values['next']), u'~' + counted(state['battles'], 'battles', translate),
                             icon=glyph('target'), tone_name='accent'))
    return rows


def hangar_widget(state, settings, translate, vehicle=None):
    values = moe_macros(state)
    value = values['percent'] + PERCENT_SUFFIX if is_number(state['percent']) else None
    chips = [card_chip(values['ema'], glyph('damage'), 'text', translate('hangar_marks_chip_average'))]
    if state['pace'] is not None:
        chips.append(card_chip(values['pace'], glyph('trend_up'), 'text', translate('hangar_marks_chip_pace')))
    if not state['has_curve']:
        rows = [card_row(translate('hangar_marks_no_curve'), status='idle', text_tone='muted')]
    else:
        rows = target_rows(state, translate) if settings.get('show_targets') else []
        rows.extend(extra_rows(state, settings, translate, values))
    icon = mark_icon(state['marks']) or glyph('target')
    return card(translate('hangar_marks_title'), icon, rows, value=value, value_tone=percent_tone(state), subtitle=vehicle, chips=chips,
                rail='progress', width=CARD_WIDTH)
