# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number, to_text
from ....core.format import format_number
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_chip, card_row
from .constants import CARD_WIDTH
from .ping import ping_tone

# The hangar strip: the time big with the date, then server, ping and online as chips and the selected tank's rows.


def _crew_row(info, translate):
    role = to_text(info.get('crew_role') or u'') or None
    xp = format_number(info['crew_xp'])
    return card_row(translate('hangar_info_crew_row'), xp, icon=glyph('person'), note=role, text_tone='muted')


def _training_row(info, values):
    if info['accelerated']:
        return card_row(values['training'], status='done', text_tone='success')
    return card_row(values['training'], status='idle', text_tone='muted')


def vehicle_rows(info, values, translate):
    rows = []
    if values['tiers']:
        rows.append(card_row(values['tiers'], icon=glyph('target'), text_tone='text'))
    if is_number(info.get('crew_xp')):
        rows.append(_crew_row(info, translate))
    if info.get('accelerated') is not None:
        rows.append(_training_row(info, values))
    return rows


def _chips(values, settings, ping):
    chips = []
    if settings.get('show_server') and values['server']:
        chips.append(card_chip(values['server'], glyph('globe'), 'text'))
    if settings.get('show_ping') and values['ping']:
        chips.append(card_chip(values['ping'], glyph('ping'), ping_tone(ping)))
    if settings.get('show_online') and values['online']:
        chips.append(card_chip(values['online'], glyph('platoon'), 'text'))
    return chips


def info_widget(info, values, settings, translate, ping):
    rows = vehicle_rows(info, values, translate)
    subtitle = values['vehicle'] if rows else None
    return card(
        values['date'] or None,
        glyph('clock'),
        rows,
        value=values['time'],
        subtitle=subtitle,
        chips=_chips(values, settings, ping),
        width=CARD_WIDTH,
    )
