# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.classes import class_tag
from ....core.format import format_number
from ....core.hud.icons import class_icon, glyph, shell_icon_of
from ....core.hud.widget import card, card_row
from .constants import CARD_WIDTH, MINUS, SECTORS

# Fair play: the own tank's last hit as the own feedback and the stock hit indicator showed it.


def shot_row(data, translate):
    source = data.get('source')
    if source and source != 'shot':
        return card_row(translate('death_card_source_' + source), icon=glyph('fire' if source == 'fire' else 'fall'), text_tone='warning')
    if data.get('shell'):
        return card_row(translate('death_card_shell_' + data['shell']), icon=shell_icon_of(data['shell']), text_tone='text')
    return None


def card_widget(data, settings, translate):
    if data is None:
        return None
    rows = [shot_row(data, translate)]
    if settings.get('show_modules') and data.get('modules'):
        names = u', '.join(translate('death_card_module_' + name) for name in data['modules'])
        rows.append(card_row(names, icon=glyph('module'), text_tone='warning', label=translate('death_card_row_modules')))
    sector = data.get('sector')
    if settings.get('show_direction') and sector in SECTORS:
        rows.append(card_row(translate('death_card_side_' + sector), icon=glyph('received'), label=translate('death_card_row_direction'),
                             text_tone='received'))
    damage = MINUS + format_number(data['damage']) if data.get('damage') else None
    icon = class_icon(class_tag(data.get('class')), 'red') or glyph('received')
    return card(translate('death_card_card_title'), icon, rows, value=damage, value_tone='received', subtitle=data.get('attacker') or
                translate('death_card_unknown'), rail='incoming', width=CARD_WIDTH)
