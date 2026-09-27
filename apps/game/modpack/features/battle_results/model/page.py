from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number
from ....core.format import format_epoch, format_number, format_timer
from .constants import ACTION_CLEAR, HISTORY_KEYS, SESSION_ROW, SITE_BATTLES_PATH


def compact(summary):
    return dict((key, summary.get(key)) for key in HISTORY_KEYS)


def session_of(entries, idle_s):
    run = []
    for entry in reversed(entries):
        if run and is_int(run[-1].get('time')) and is_int(entry.get('time')) and run[-1]['time'] - entry['time'] > idle_s:
            break
        run.append(entry)
    return list(reversed(run))


def _average(entries, key):
    values = [entry.get(key) for entry in entries if is_number(entry.get(key))]
    return float(sum(values)) / len(values) if values else None


def session_row(entries, translate):
    battles = len(entries)
    wins = len([entry for entry in entries if entry.get('result') == 'win'])
    rate = 100.0 * wins / battles if battles else 0.0
    net = sum(entry.get('net_credits') or 0 for entry in entries)
    return {
        'id': SESSION_ROW,
        'title': translate('br_session_title', battles=battles),
        'subtitle': translate('br_session_line', winrate='%.1f%%' % rate, damage=format_number(_average(entries, 'damage')),
                              assist=format_number(_average(entries, 'assist')), xp=format_number(_average(entries, 'xp'))),
        'meta': translate('br_session_credits', credits=format_number(net)),
        'badge': None,
        'link': None,
        'details': [],
        'actions': [],
    }


def _pair(label, value):
    return {'label': label, 'value': value}


def detail_rows(entry, translate):
    signed_moe = entry.get('moe_delta')
    moe = '%.2f%%' % entry['moe_percent'] if entry.get('moe_percent') is not None else None
    if moe and signed_moe is not None:
        moe += ' (%s%.2f%%)' % ('+' if signed_moe > 0 else '', signed_moe)
    rows = [
        _pair(translate('br_detail_damage'), format_number(entry.get('damage'))),
        _pair(translate('br_detail_assist'), '%s (%s / %s / %s)' % (format_number(entry.get('assist')), format_number(entry.get('assist_radio')),
                                                                    format_number(entry.get('assist_track')), format_number(entry.get('assist_stun')))),
        _pair(translate('br_detail_blocked'), format_number(entry.get('blocked'))),
        _pair(translate('br_detail_frags_spotted'), '%s / %s' % (format_number(entry.get('frags')), format_number(entry.get('spotted')))),
        _pair(translate('br_detail_shots'), '%s / %s / %s' % (format_number(entry.get('shots')), format_number(entry.get('hits')),
                                                              format_number(entry.get('pens')))),
        _pair(translate('br_detail_xp'), '%s (%s)' % (format_number(entry.get('xp')), format_number(entry.get('free_xp')))),
        _pair(translate('br_detail_credits'), format_number(entry.get('credits'))),
        _pair(translate('br_detail_costs'), '%s / %s / %s' % (format_number(entry.get('repair')), format_number(entry.get('ammo')),
                                                              format_number(entry.get('consumables')))),
        _pair(translate('br_detail_net'), format_number(entry.get('net_credits'))),
        _pair(translate('br_detail_life'), '%s / %s' % (format_timer(entry.get('life_time')), format_timer(entry.get('duration')))),
    ]
    if moe:
        rows.append(_pair(translate('br_detail_moe'), moe))
    return rows


def battle_row(index, entry, translate):
    head = translate('br_row_title', result=translate('br_result_' + (entry.get('result') or 'draw')), vehicle=entry.get('vehicle') or '',
                     map=entry.get('map') or '')
    delta = entry.get('moe_delta')
    return {
        'id': str(entry.get('arena') or index),
        'title': head,
        'subtitle': translate('br_row_line', damage=format_number(entry.get('damage')), assist=format_number(entry.get('assist')),
                              frags=format_number(entry.get('frags')), xp=format_number(entry.get('xp'))),
        'meta': format_epoch(entry.get('time')) if is_int(entry.get('time')) else None,
        'badge': ('%s%.2f%%' % ('+' if delta > 0 else '', delta)) if delta is not None else None,
        'link': None,
        'details': detail_rows(entry, translate),
        'actions': [],
    }


def build_page(entries, translate, idle_s):
    rows = []
    session = session_of(entries, idle_s)
    if session:
        rows.append(session_row(session, translate))
    for index in range(len(entries) - 1, -1, -1):
        rows.append(battle_row(index, entries[index], translate))
    return {'kind': 'list', 'empty': translate('br_empty'), 'rows': rows}


def page_actions(translate):
    return [
        {'id': 'site', 'label': translate('br_site'), 'link': SITE_BATTLES_PATH, 'confirm': None},
        {'id': ACTION_CLEAR, 'label': translate('br_clear'), 'confirm': translate('br_clear_confirm')},
    ]
