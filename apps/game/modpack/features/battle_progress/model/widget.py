from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from .constants import CARD_WIDTH, ROW_GLYPHS


def _card_row(row):
    return card_row(
        row['text'],
        row['value'],
        icon=glyph(ROW_GLYPHS[row['kind']]),
        tone_name=row['tone'],
        color=row['color'],
        text_tone='muted',
        note=row['note'],
        detail=row['detail'],
        progress=row['progress'],
        progress_tone=row['progress_tone'],
    )


def panel_widget(rows):
    if not rows:
        return None
    return card(rows=[_card_row(row) for row in rows], width=CARD_WIDTH)
