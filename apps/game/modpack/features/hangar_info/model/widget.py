# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number, to_text
from ....core.format import format_number
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_chip, card_row
from .constants import CARD_WIDTH, PING_LOW_MS, PING_NORM_MS


def ping_tone(ping):
    if ping is None:
        return 'muted'
    if ping <= PING_LOW_MS:
        return 'good'
    return 'warning' if ping <= PING_NORM_MS else 'bad'


def vehicle_rows(info, values, translate):
    rows = []
    if values['tiers']:
        rows.append(card_row(values['tiers'], icon=glyph('target'), text_tone='text'))
    if is_number(info.get('crew_xp')):
        role = to_text(info.get('crew_role') or u'') or None
        rows.append(card_row(translate('hangar_info_crew_row'), format_number(info['crew_xp']), icon=glyph('person'), note=role, text_tone='muted'))
    if info.get('accelerated') is not None:
        rows.append(card_row(values['training'], status='done' if info['accelerated'] else 'idle',
                             text_tone='success' if info['accelerated'] else 'muted'))
    return rows


def info_widget(info, values, settings, translate, ping):
    """The hangar strip: the time big with the date, then server, ping and online as chips and the selected tank's rows."""
    chips = []
    if settings.get('show_server') and values['server']:
        chips.append(card_chip(values['server'], glyph('globe'), 'text'))
    if settings.get('show_ping') and values['ping']:
        chips.append(card_chip(values['ping'], glyph('ping'), ping_tone(ping)))
    if settings.get('show_online') and values['online']:
        chips.append(card_chip(values['online'], glyph('platoon'), 'text'))
    rows = vehicle_rows(info, values, translate)
    return card(values['date'] or None, glyph('clock'), rows, value=values['time'], subtitle=values['vehicle'] if rows else None, chips=chips,
                width=CARD_WIDTH)
