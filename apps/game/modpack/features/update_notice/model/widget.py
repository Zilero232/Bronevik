from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from . import notes_line
from .constants import CARD_WIDTH


def hangar_widget(update, translate):
    notes = notes_line(update, translate.language)
    changed = translate('update_notice_changed', count=update['outdated'])
    rows = [card_row(changed, icon=glyph('trend_up'), detail=notes or None)]
    return card(
        translate('update_notice_card_title'),
        glyph('globe'),
        rows,
        value=update['version'],
        value_tone='gold',
        footer=translate('update_notice_footer'),
        width=CARD_WIDTH,
    )
