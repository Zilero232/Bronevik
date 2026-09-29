# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int
from ....core.hud.icons import class_icon, flag_icon, mark_icon, tier_icon
from .constants import NATION_NAMES, REPORT_BATTLES, REPORT_CHART, REPORT_TRENDS, SOURCE_BATTLE
from .history import percent

# The «Расчёт отметок» page of one tank: everything comes from the player's own marks history (own dossier values after
# each own battle); nothing is read about anyone else.


def nation_of(tank_id):
    """The nation of a vehicle compact descriptor (items.parseIntCompactDescr, RU 1.45: bits 4-7)."""
    if not is_int(tank_id):
        return None
    index = (tank_id >> 4) & 15
    return NATION_NAMES[index] if index < len(NATION_NAMES) else None


def _delta(before, after):
    first, last = percent(before.get('rating')) if before else None, percent(after.get('rating'))
    return round(last - first, 2) if first is not None and last is not None else None


def battle_rows(entries):
    rows = []
    for index, entry in enumerate(entries):
        if entry.get('source') != SOURCE_BATTLE:
            continue
        rows.append({'t': entry.get('t'), 'damage': entry.get('combined'), 'percent': percent(entry.get('rating')),
                     'delta': _delta(entries[index - 1] if index > 0 else None, entry), 'result': entry.get('result')})
    return list(reversed(rows))


def trend(rows, count):
    window = [row['delta'] for row in rows[:count] if row['delta'] is not None]
    return {'battles': len(window), 'delta': round(sum(window), 2) if window else None}


def best(rows):
    scored = [row for row in rows if is_int(row.get('damage'))]
    return max(scored, key=lambda row: row['damage']) if scored else None


def marks_report(tank_id, vehicle):
    entries = vehicle.get('entries') or []
    if not entries:
        return None
    last = entries[-1]
    rows = battle_rows(entries)
    nation = nation_of(tank_id)
    kind = vehicle.get('class')
    tier = vehicle.get('tier')
    return {
        'name': vehicle.get('label') or u'',
        'tier': tier if is_int(tier) else None,
        'tier_icon': tier_icon(tier),
        'flag': flag_icon(nation),
        'cls': class_icon(kind),
        'percent': percent(last.get('rating')),
        'marks': last.get('marks') if is_int(last.get('marks')) else 0,
        'mark': mark_icon(last.get('marks')),
        'avg': last.get('avg') if is_int(last.get('avg')) else None,
        'last': rows[0] if rows else None,
        'best': best(rows),
        'record': max([value for value in (percent(entry.get('rating')) for entry in entries) if value is not None] or [None]),
        'trends': [dict(trend(rows, count), window=count) for count in REPORT_TRENDS],
        'battles': rows[:REPORT_BATTLES],
        'chart': [value for value in (percent(entry.get('rating')) for entry in entries[-REPORT_CHART:]) if value is not None],
    }
