# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from . import left_label, right_label, side_tone
from .constants import CARD_WIDTH


def panel_widget(state, settings, translate):
    if state is None:
        return None
    warn = settings.get('warn_deg')
    left = state['left']
    right = state['right']
    shows_degrees = settings.get('show_degrees')
    progress = state['position'] if settings.get('show_bar') else None

    row = card_row(
        left_label(left) if shows_degrees else None,
        right_label(right) if shows_degrees else None,
        icon=glyph('traverse'),
        text_tone=side_tone(left, warn),
        tone_name=side_tone(right, warn),
        progress=progress,
        progress_tone='accent',
    )
    return card(None, None, [row], width=CARD_WIDTH)
