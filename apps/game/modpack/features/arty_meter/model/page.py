# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_epoch, format_number
from .constants import ACTION_CLEAR, DATE_FORMAT, TODAY_ROW


def _row_text(values, translate):
    return translate('arty_meter_row', hits=values['hits'], splash=values['splash'], modules=values['modules'], stuns=values['stuns'],
                     damage=format_number(values['damage']))


def build_page(book, now, translate, limit):
    rows = []
    day = book.day(now)
    if day['battles']:
        rows.append({'id': TODAY_ROW, 'title': translate('arty_meter_today'), 'subtitle': _row_text(day, translate),
                     'meta': u'%d' % day['battles'], 'badge': format_number(day['hits'] + day['splash']), 'link': None, 'details': [],
                     'actions': []})
    for index, entry in enumerate(book.recent(limit)):
        title = u' · '.join(part for part in (entry['map'], entry['tank']) if part) or u'—'
        rows.append({'id': u'%d-%d' % (entry['t'], index), 'title': title, 'subtitle': _row_text(entry, translate),
                     'meta': format_epoch(entry['t'], DATE_FORMAT) or u'', 'badge': format_number(entry['hits'] + entry['splash']), 'link': None,
                     'details': [], 'actions': []})
    return {'kind': 'list', 'empty': translate('arty_meter_empty'), 'rows': rows}


def page_actions(translate):
    return [{'id': ACTION_CLEAR, 'label': translate('arty_meter_clear'), 'confirm': translate('arty_meter_clear_confirm'), 'link': None}]
