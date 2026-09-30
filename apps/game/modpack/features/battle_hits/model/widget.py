# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import counted, format_number
from ....core.hud.icons import glyph, outcome_icon
from ....core.hud.widget import card, card_chip, card_row
from .book import summary
from .constants import CARD_WIDTH, MINUS, PART_ORDER, SEPARATOR, SIDED_PARTS, SIDES

# The hangar card of the last battle: the damage taken big on the right, the outcomes as icon + number chips and one row
# per hit part with its sides; the per-hit list stays in the mod window.


def part_row(stats, part, translate):
    count = stats['parts'][part]
    sides = []
    if part in SIDED_PARTS:
        sides = [u'%s %d' % (translate('battle_hits_side_' + side), stats['sides'][part][side]) for side in SIDES if stats['sides'][part][side]]
    return card_row(SEPARATOR.join(sides) or None, format_number(count), label=translate('battle_hits_part_' + part))


def hangar_widget(battle, translate):
    stats = summary(battle)
    counts = stats['counts']
    chips = [
        card_chip(format_number(counts['pen'] + counts['crit']), outcome_icon('pen'), 'received', translate('battle_hits_chip_pen')),
        card_chip(format_number(counts['blocked'] + counts['nodamage']), outcome_icon('no_pen'), 'blocked', translate('battle_hits_chip_blocked')),
        card_chip(format_number(counts['ricochet']), outcome_icon('ricochet'), 'blocked', translate('battle_hits_chip_ricochet')),
    ]
    rows = [part_row(stats, part, translate) for part in PART_ORDER if stats['parts'][part]]
    damage = MINUS + format_number(stats['damage']) if stats['damage'] else None
    return card(translate('battle_hits_card_title'), glyph('shield_hit'), rows, value=damage, value_tone='received',
                subtitle=battle.get('vehicle') or None, chips=chips, footer=counted(stats['hits'], 'hits', translate), rail='incoming', width=CARD_WIDTH)
