# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from .constants import ARROW_LEFT, ARROW_RIGHT, CARD_WIDTH


def side_tone(degrees, warn):
    if degrees < 0.5:
        return 'bad'
    return 'warning' if degrees <= warn else 'text'


def panel_widget(state, settings, translate):
    if state is None:
        return None
    warn = settings.get('warn_deg')
    left, right = state['left'], state['right']
    degrees = settings.get('show_degrees')
    row = card_row(u'%s %d°' % (ARROW_LEFT, int(round(left))) if degrees else None, u'%d° %s' % (int(round(right)), ARROW_RIGHT) if degrees else None,
                   icon=glyph('traverse'), text_tone=side_tone(left, warn), tone_name=side_tone(right, warn),
                   progress=state['position'] if settings.get('show_bar') else None, progress_tone='accent')
    return card(None, None, [row], width=CARD_WIDTH)
