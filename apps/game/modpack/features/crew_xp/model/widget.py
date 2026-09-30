from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_number
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from . import battles_text, share
from .constants import CARD_WIDTH


def member_row(member, translate):
    if member['xp_left'] == 0:
        return card_row(member['role'], translate('crew_xp_ready_short'), icon=glyph('check'), tone_name='success')
    return card_row(
        member['role'],
        format_number(member['xp_left']),
        icon=glyph('person'),
        note=battles_text(member, translate),
        detail=member['name'] or None,
        progress=share(member),
        progress_tone='accent',
    )


def hangar_widget(crew, translate):
    if not crew:
        return None
    return card(
        translate('crew_xp_card_title'),
        glyph('person'),
        [member_row(member, translate) for member in crew],
        footer=translate('crew_xp_footer'),
        width=CARD_WIDTH,
    )
