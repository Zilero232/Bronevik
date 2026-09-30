# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, counted, font, format_epoch, format_number
from .constants import ACTION_CLEAR, MAX_DETAIL_LINES, SITE_PROGRESS_PATH, SOURCE_BATTLE
from .history import percent
from .report import marks_report


def signed_percent(value):
    if value is None:
        return u''
    return (u'+%.2f%%' if value > 0 else u'%.2f%%') % value


def _stars(marks):
    return u'★' * marks if marks else u'—'


def _entry_line(before, entry, translate):
    moment = format_epoch(entry.get('t'), '%d.%m %H:%M') or u''
    value = percent(entry.get('rating'))
    text = u'%s  %.2f%%' % (moment, value) if value is not None else moment
    if before is not None and percent(before.get('rating')) is not None and value is not None:
        text += u' (%s)' % signed_percent(round(value - percent(before.get('rating')), 2))
    if entry.get('source') == SOURCE_BATTLE:
        text += u', ' + translate('marks_history_battle', damage=format_number(entry.get('combined')))
    else:
        text += u', ' + translate('marks_history_hangar')
    return text


def detail_rows(vehicle, translate):
    rows = []
    reached = vehicle.get('reached') or {}
    for mark in sorted(reached, key=int):
        rows.append({'label': translate('marks_history_reached', mark=mark), 'value': format_epoch(reached[mark]) or u''})
    entries = vehicle.get('entries') or []
    start = max(0, len(entries) - MAX_DETAIL_LINES)
    for index in range(len(entries) - 1, start - 1, -1):
        before = entries[index - 1] if index > 0 else None
        rows.append({'label': u'', 'value': _entry_line(before, entries[index], translate)})
    return rows


def row_of(tank_id, vehicle, summary, translate):
    subtitle = u'%s  %s' % (u'%.2f%%' % summary['percent'] if summary['percent'] is not None else u'—', _stars(summary['marks']))
    if summary.get('avg'):
        subtitle += u'  ' + translate('marks_history_avg', avg=format_number(summary['avg']))
    trend = summary.get('trend')
    meta = format_epoch(summary.get('updated')) or u''
    if trend is not None:
        meta += u' / ' + translate('marks_history_trend', battles=counted(summary['trend_battles'], 'battles', translate), delta=signed_percent(trend))
    return {
        'id': str(tank_id),
        'title': summary['label'] or str(tank_id),
        'subtitle': subtitle,
        'meta': meta,
        'badge': signed_percent(summary['last_delta']) or None,
        'link': None,
        'details': detail_rows(vehicle, translate),
        'report': marks_report(int(tank_id), vehicle),
        'actions': [{'id': ACTION_CLEAR, 'label': translate('marks_history_clear'),
                     'confirm': translate('marks_history_clear_confirm', vehicle=summary['label'] or tank_id)}],
    }


def build_page(history, translate, trend_battles, max_rows):
    rows = []
    for tank_id in history.ordered()[:max_rows]:
        summary = history.summary(tank_id, trend_battles)
        if summary is not None:
            rows.append(row_of(tank_id, history.vehicle(tank_id), summary, translate))
    return {'kind': 'list', 'empty': translate('marks_history_empty'), 'rows': rows}


def page_actions(translate):
    return [{'id': 'site', 'label': translate('marks_history_site'), 'link': SITE_PROGRESS_PATH, 'confirm': None}]


def _colored_delta(value):
    if value is None:
        return u''
    return font(signed_percent(value), COLOR_UP if value > 0 else (COLOR_DOWN if value < 0 else COLOR_NEUTRAL))


def panel_text(summary, translate):
    lines = [font(translate('marks_history_title'), COLOR_NEUTRAL, 15)]
    value = u'%.2f%%' % summary['percent'] if summary['percent'] is not None else u'—'
    lines.append(u'%s %s' % (font(value, COLOR_NEUTRAL), font(_stars(summary['marks']), COLOR_NEUTRAL)))
    if summary.get('last_delta') is not None:
        lines.append(u'%s %s' % (font(translate('marks_history_last'), COLOR_MUTED), _colored_delta(summary['last_delta'])))
    if summary.get('trend') is not None and summary.get('trend_battles', 0) > 1:
        label = translate('marks_history_trend_label', battles=counted(summary['trend_battles'], 'battles', translate))
        lines.append(u'%s %s' % (font(label, COLOR_MUTED), _colored_delta(summary['trend'])))
    return u'\n'.join(lines)
