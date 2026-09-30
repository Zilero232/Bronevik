# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import counted, format_number
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from . import caravan_time_left, remaining
from .constants import CARD_WIDTH


def _battle_row(place, battle):
    return card_row(
        battle['tank'] or u'-',
        format_number(battle['xp']),
        label=u'%d.' % place,
        tone_name='gold' if place == 1 else 'text',
    )


def _triathlon_rows(view, translate):
    rows = [_battle_row(place, battle) for place, battle in enumerate(view['battles'], 1)]
    if view['count']:
        rows.append(card_row(
            translate('event_trackers_round_battles_row'),
            counted(view['count'], 'battles', translate),
            icon=glyph('session'),
            text_tone='muted',
        ))
    if view['best'] is not None:
        rows.append(card_row(
            translate('event_trackers_best_round'),
            format_number(view['best']),
            icon=glyph('record'),
            text_tone='muted',
        ))
    return rows


def triathlon_widget(view, translate):
    value = format_number(view['score']) if view['score'] is not None else None
    return card(
        view['title'],
        glyph('points'),
        _triathlon_rows(view, translate),
        value=value,
        value_tone='gold',
        subtitle=view['state'],
        rail='progress',
        footer=view['rule'],
        width=CARD_WIDTH,
    )


def caravan_widget(caravan, now, translate):
    rows = []
    time_left = caravan_time_left(caravan, now)
    if time_left is not None:
        rows.append(card_row(
            translate('event_trackers_caravan_ends'),
            remaining(time_left, translate),
            icon=glyph('clock'),
            text_tone='muted',
        ))

    return card(
        translate('event_trackers_caravan'),
        glyph('globe'),
        rows,
        value=counted(caravan['coins'], 'tokens', translate),
        value_tone='gold',
        rail='info',
        footer=translate('event_trackers_caravan_footer'),
        width=CARD_WIDTH,
    )
