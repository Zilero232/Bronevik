# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_NEUTRAL, COLOR_WARN

BAR_CELLS = 15
BAR_TRACK = u'─'
BAR_MARK = u'●'
BAR_LEFT = u'├'
BAR_RIGHT = u'┤'
ARROW_LEFT = u'◄'
ARROW_RIGHT = u'►'
# Under half a degree left reads as the limit reached.
LIMIT_REACHED_DEG = 0.5
# A side's tone (the card's tone names) and its colour in the text panel.
TONE_COLORS = {'bad': COLOR_DOWN, 'warning': COLOR_WARN, 'text': COLOR_NEUTRAL}
# The own turret turns smoothly; ten reads a second are enough for a readout and cost nothing.
TICK_S = 0.1

PREVIEW_SIZE = (260, 30)
PREVIEW_LIMITS = (-0.35, 0.35)
PREVIEW_YAW = 0.18

# The card (model/widget.py), design px.
CARD_WIDTH = 200
