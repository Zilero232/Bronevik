# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.classes import class_tag
from ....core.format import format_number
from ....core.hud.icons import class_icon, glyph, outcome_icon
from ....core.hud.widget import card, card_chip, card_row
from .constants import CARD_WIDTH, MINUS, OUTCOME_TONES

# Fair play: the hits on the player's own tank from the player's own feedback, as the vanilla damage log shows them.


def entry_row(entry, settings, translate):
    outcome = entry['outcome']
    if outcome == 'pen':
        value = MINUS + format_number(entry['damage'])
    else:
        value = translate('received_hits_outcome_' + outcome)
    note = translate('received_hits_with_crits', crits=entry['crits']) if entry['crits'] else None
    if settings.get('show_shell') and entry['shell'] and note is None:
        note = translate('received_hits_shell_' + entry['shell'])
    icon = class_icon(class_tag(entry['class']), 'red') if settings.get('show_class') and entry['class'] else outcome_icon(outcome)
    return card_row(entry['attacker'] or u'?', value, icon=icon, tone_name=OUTCOME_TONES[outcome], note=note)


def panel_widget(hits, settings, translate):
    if settings.get('line_template'):
        return None
    rows = [entry_row(entry, settings, translate) for entry in hits.recent(settings.get('lines'))]
    if not rows:
        return None
    totals = hits.totals
    chips = []
    if settings.get('show_header'):
        chips = [card_chip(format_number(totals['hits']), glyph('shield_hit'), 'text', translate('received_hits_chip_hits')),
                 card_chip(format_number(totals['pen']), outcome_icon('pen'), 'received', translate('received_hits_chip_pen')),
                 card_chip(format_number(totals['blocked_damage']), glyph('blocked'), 'blocked', translate('received_hits_chip_blocked'))]
    damage = MINUS + format_number(totals['damage']) if totals['damage'] else None
    return card(translate('received_hits_card_title'), glyph('received'), rows, value=damage, value_tone='received', rail='incoming', chips=chips,
                width=CARD_WIDTH)
