# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.format import counted, format_number
from ....core.hud.icons import glyph, mark_icon
from ....core.hud.widget import card, card_chip, card_row
from ....core.moe import moe_macros
from . import target_levels
from .constants import CARD_WIDTH, PERCENT_SUFFIX, TONE_BY_MARKS

# Fair play: the player's own marks of excellence of the selected tank (own dossier, own average and pace).


def percent_tone(state):
    marks = int(state['marks']) if is_number(state['marks']) else 0
    index = max(0, min(marks, len(TONE_BY_MARKS) - 1))
    return TONE_BY_MARKS[index]


def _target_row(level, state, translate):
    need = state['need'][level]
    label = u'%d%s' % (level, PERCENT_SUFFIX)
    if is_number(need) and need <= 0:
        return card_row(None, translate('hangar_marks_reached'), label=label, status='done', tone_name='success')

    status = 'active' if level == state['next_level'] else 'idle'
    note = translate('hangar_marks_per_battle')
    return card_row(None, format_number(need), label=label, status=status, note=note)


def target_rows(state, translate):
    return [_target_row(level, state, translate) for level in target_levels(state)]


def forecast_row(state, settings, translate, values):
    if not settings.get('show_forecast') or state['next_level'] is None or state['battles'] is None:
        return None
    text = translate('hangar_marks_forecast', next=values['next'])
    battles = u'~' + counted(state['battles'], 'battles', translate)
    return card_row(text, battles, icon=glyph('target'), tone_name='accent')


def _rows(state, settings, translate, values):
    if not state['has_curve']:
        return [card_row(translate('hangar_marks_no_curve'), status='idle', text_tone='muted')]
    rows = target_rows(state, translate) if settings.get('show_targets') else []
    forecast = forecast_row(state, settings, translate, values)
    if forecast is not None:
        rows.append(forecast)
    return rows


def _chips(state, values, translate):
    chips = [card_chip(values['ema'], glyph('damage'), 'text', translate('hangar_marks_chip_average'))]
    if state['pace'] is not None:
        chips.append(card_chip(values['pace'], glyph('trend_up'), 'text', translate('hangar_marks_chip_pace')))
    return chips


def hangar_widget(state, settings, translate, vehicle=None):
    values = moe_macros(state)
    percent = values['percent'] + PERCENT_SUFFIX if is_number(state['percent']) else None
    icon = mark_icon(state['marks']) or glyph('target')
    return card(
        translate('hangar_marks_title'),
        icon,
        _rows(state, settings, translate, values),
        value=percent,
        value_tone=percent_tone(state),
        subtitle=vehicle,
        chips=_chips(state, values, translate),
        rail='progress',
        width=CARD_WIDTH,
    )
