# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_number
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from . import division_name, next_text, progress, status_text, threshold_value, thresholds
from .constants import CARD_WIDTH, STATUS_TONES


def next_row(state, translate):
    found = progress(state)
    text = next_text(state, translate)
    if found is None or text is None:
        return None
    return card_row(text, icon=glyph('trend_up'), progress=found[2], progress_tone='gold')


def threshold_row(step, status, translate):
    return card_row(division_name(step, translate), threshold_value(step, translate), status=status, tone_name=STATUS_TONES[status],
                    text_tone='muted' if status == 'idle' else 'text')


def hangar_widget(state, settings, translate):
    if state is None:
        return None
    rows = [next_row(state, translate)]
    if settings.get('show_thresholds'):
        rows.extend(threshold_row(step, status, translate) for step, status in thresholds(state))
    if settings.get('show_skill') and state['skill']:
        rows.append(card_row(state['skill'], icon=glyph('module'), label=translate('comp7_helper_skill')))
    return card(translate('comp7_helper_card_title'), glyph('record'), rows, value=format_number(state['rating']), value_tone='gold',
                subtitle=status_text(state, translate), rail='progress', footer=translate('comp7_helper_footer'), width=CARD_WIDTH)
