# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import counted, format_number
from ....core.hud.icons import glyph, outcome_icon
from ....core.hud.widget import card, card_chip, card_row
from .book import summary
from .constants import CARD_WIDTH, MINUS, PART_ORDER, SEPARATOR
from .page import side_counts

# The hangar card of the last battle: the damage taken big on the right, the outcomes as icon + number chips and one row
# per hit part with its sides; the per-hit list stays in the mod window.


def part_row(stats, part, translate):
    sides = SEPARATOR.join(side_counts(stats, part, translate))
    count = format_number(stats['parts'][part])
    return card_row(sides or None, count, label=translate('battle_hits_part_' + part))


def outcome_chips(counts, translate):
    penetrated = counts['pen'] + counts['crit']
    blocked = counts['blocked'] + counts['nodamage']
    return [
        card_chip(format_number(penetrated), outcome_icon('pen'), 'received', translate('battle_hits_chip_pen')),
        card_chip(format_number(blocked), outcome_icon('no_pen'), 'blocked', translate('battle_hits_chip_blocked')),
        card_chip(
            format_number(counts['ricochet']),
            outcome_icon('ricochet'),
            'blocked',
            translate('battle_hits_chip_ricochet'),
        ),
    ]


def hangar_widget(battle, translate):
    stats = summary(battle)
    rows = [part_row(stats, part, translate) for part in PART_ORDER if stats['parts'][part]]
    damage = MINUS + format_number(stats['damage']) if stats['damage'] else None

    return card(
        translate('battle_hits_card_title'),
        glyph('shield_hit'),
        rows,
        value=damage,
        value_tone='received',
        subtitle=battle.get('vehicle') or None,
        chips=outcome_chips(stats['counts'], translate),
        footer=counted(stats['hits'], 'hits', translate),
        rail='incoming',
        width=CARD_WIDTH,
    )
