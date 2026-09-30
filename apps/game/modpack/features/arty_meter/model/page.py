# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_epoch, format_number
from .constants import ACTION_CLEAR, DATE_FORMAT, TODAY_ROW


def _row(row_id, title, meta, values, translate):
    subtitle = translate(
        'arty_meter_row',
        hits=values['hits'],
        splash=values['splash'],
        modules=values['modules'],
        stuns=values['stuns'],
        damage=format_number(values['damage']),
    )
    return {
        'id': row_id,
        'title': title,
        'subtitle': subtitle,
        'meta': meta,
        'badge': format_number(values['hits'] + values['splash']),
        'link': None,
        'details': [],
        'actions': [],
    }


def _battle_title(entry):
    return u' · '.join(part for part in (entry['map'], entry['tank']) if part) or u'—'


def build_page(book, now, translate, limit):
    rows = []
    day = book.day(now)
    if day['battles']:
        rows.append(_row(TODAY_ROW, translate('arty_meter_today'), u'%d' % day['battles'], day, translate))
    for index, entry in enumerate(book.recent(limit)):
        row_id = u'%d-%d' % (entry['t'], index)
        meta = format_epoch(entry['t'], DATE_FORMAT) or u''
        rows.append(_row(row_id, _battle_title(entry), meta, entry, translate))
    return {'kind': 'list', 'empty': translate('arty_meter_empty'), 'rows': rows}


def page_actions(translate):
    return [{
        'id': ACTION_CLEAR,
        'label': translate('arty_meter_clear'),
        'confirm': translate('arty_meter_clear_confirm'),
        'link': None,
    }]
