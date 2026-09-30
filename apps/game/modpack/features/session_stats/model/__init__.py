# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import uuid

from ....core.compat import is_int, is_number
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_number, format_percent
from .constants import COUNTERS, PENDING_RESULTS_TTL_S, RECENT_LIMIT, REGULAR_BONUS_TYPE, RESULT_COLORS, RESULTS
from .widget import session_widget  # noqa: F401


def _ratio(numerator, denominator, digits=2):
    if not denominator:
        return None
    return round(float(numerator) / denominator, digits)


def _percent(numerator, denominator):
    if not denominator:
        return None
    return round(100.0 * numerator / denominator, 2)


class SessionAggregator(object):

    def __init__(self, idle_seconds=3600, counted_bonus_types=(REGULAR_BONUS_TYPE,)):
        self.idle_seconds = idle_seconds
        self.counted_bonus_types = tuple(counted_bonus_types)
        self.session_id = None
        self.started_at = None
        self.last_activity_at = None
        self.totals = dict((name, 0) for name in COUNTERS)
        self.vehicles = {}
        self.server = {}
        self.recent = []
        self.pending = {}
        self.discarded = set()

    def _reset(self, now):
        self.session_id = uuid.uuid4().hex
        self.started_at = int(now)
        self.last_activity_at = int(now)
        self.totals = dict((name, 0) for name in COUNTERS)
        self.vehicles = {}
        self.server = {}
        self.recent = []

    def reset(self, now):
        self.discarded.update(self.pending)
        self.pending = {}

        self._reset(now)

        return self.session_id

    def is_expired(self, now):
        return self.session_id is None or now - self.last_activity_at > self.idle_seconds

    def touch(self, now):
        if self.is_expired(now):
            self._reset(now)
        else:
            self.last_activity_at = int(now)
        return self.session_id

    def counts(self, battle):
        return battle.get('bonus_type') in self.counted_bonus_types

    def started(self, arena_id, bonus_type, now):
        self.touch(now)

        if not arena_id:
            return
        if bonus_type not in self.counted_bonus_types:
            return

        self.pending[str(arena_id)] = int(now)

    def results_arrived(self, arena_id):
        self.pending.pop(str(arena_id), None)

    def pending_count(self, now):
        oldest_start = now - PENDING_RESULTS_TTL_S
        self.pending = dict((arena_id, started_at) for arena_id, started_at in self.pending.items()
                            if started_at >= oldest_start)

        return len(self.pending)

    def _is_discarded(self, arena_id):
        if arena_id not in self.discarded:
            return False

        self.discarded.discard(arena_id)

        return True

    def _remember_result(self, result):
        if result not in RESULTS:
            return

        self.recent.append(result)
        self.recent = self.recent[-RECENT_LIMIT:]

    def add(self, battle, now):
        arena_id = battle.get('arena_unique_id')
        self.results_arrived(arena_id)
        if self._is_discarded(arena_id):
            return None

        session_id = self.touch(now)
        if not self.counts(battle):
            return session_id
        stats = battle.get('stats') or {}
        result = battle.get('result')
        increments = {
            'battles': 1,
            'wins': 1 if result == 'win' else 0,
            'losses': 1 if result == 'loss' else 0,
            'draws': 1 if result == 'draw' else 0,
            'survived': 1 if stats.get('is_alive') else 0,
            'damage_dealt': stats.get('damage_dealt', 0),
            'damage_assisted': (stats.get('damage_assisted_radio', 0)
                                + stats.get('damage_assisted_track', 0)
                                + stats.get('damage_assisted_stun', 0)),
            'damage_blocked': stats.get('damage_blocked', 0),
            'frags': stats.get('frags', 0),
            'spotted': stats.get('spotted', 0),
            'xp': stats.get('xp', 0),
            'credits': stats.get('credits', 0),
            'shots': stats.get('shots', 0),
            'direct_enemy_hits': stats.get('direct_enemy_hits', 0),
            'piercing_enemy_hits': stats.get('piercing_enemy_hits', 0),
        }
        for name, value in increments.items():
            if is_number(value):
                self.totals[name] += value
        tank_id = (battle.get('vehicle') or {}).get('tank_id')
        if is_int(tank_id):
            key = str(tank_id)
            entry = self.vehicles.setdefault(key, {'battles': 0, 'wins': 0, 'damage_dealt': 0})
            entry['battles'] += 1
            entry['wins'] += increments['wins']
            entry['damage_dealt'] += increments['damage_dealt']
        self._remember_result(result)
        return session_id

    def set_server_summary(self, session_id, data):
        if session_id != self.session_id or not isinstance(data, dict):
            return False
        wn8 = data.get('wn8')
        self.server = {'wn8': round(float(wn8), 0) if is_number(wn8) else None}
        return True

    def summary(self, now):
        t = self.totals
        battles = t['battles']
        return {
            'session_id': self.session_id,
            'started_at': self.started_at,
            'last_activity_at': self.last_activity_at,
            'battles': battles,
            'wins': t['wins'],
            'losses': t['losses'],
            'draws': t['draws'],
            'win_rate': _percent(t['wins'], battles),
            'survival_rate': _percent(t['survived'], battles),
            'avg_damage': _ratio(t['damage_dealt'], battles, 0),
            'avg_assist': _ratio(t['damage_assisted'], battles, 0),
            'avg_blocked': _ratio(t['damage_blocked'], battles, 0),
            'avg_frags': _ratio(t['frags'], battles),
            'avg_spotted': _ratio(t['spotted'], battles),
            'avg_xp': _ratio(t['xp'], battles, 0),
            'credits_total': t['credits'],
            'hit_rate': _percent(t['direct_enemy_hits'], t['shots']),
            'pen_rate': _percent(t['piercing_enemy_hits'], t['direct_enemy_hits']),
            'wn8': self.server.get('wn8'),
            'vehicles': dict((k, dict(v)) for k, v in self.vehicles.items()),
            'recent': list(self.recent),
            'pending': self.pending_count(now),
        }

    def to_dict(self):
        return {
            'session_id': self.session_id,
            'started_at': self.started_at,
            'last_activity_at': self.last_activity_at,
            'totals': dict(self.totals),
            'vehicles': dict((k, dict(v)) for k, v in self.vehicles.items()),
            'server': dict(self.server),
            'recent': list(self.recent),
        }

    def load(self, data):
        if not isinstance(data, dict) or not data.get('session_id'):
            return False
        if not is_int(data.get('started_at')) or not is_int(data.get('last_activity_at')):
            return False
        self.session_id = data['session_id']
        self.started_at = data['started_at']
        self.last_activity_at = data['last_activity_at']
        totals = data.get('totals') or {}
        self.totals = dict((name, totals.get(name, 0) if is_number(totals.get(name, 0)) else 0) for name in COUNTERS)
        self.vehicles = dict(data.get('vehicles') or {})
        self.server = dict(data.get('server') or {})
        self.recent = _known_results(data.get('recent'))
        return True


def _known_results(values):
    if not isinstance(values, list):
        return []

    known = [result for result in values if result in RESULTS]

    return known[-RECENT_LIMIT:]


def _recent_line(recent, translate):
    marks = [font(translate('session_result_' + result), RESULT_COLORS[result]) for result in recent]

    return u'%s: %s' % (font(translate('session_recent'), COLOR_MUTED), u' '.join(marks))


def format_session_panel(summary, translate):
    rows = [
        (translate('session_battles'), format_number(summary.get('battles'))),
        (translate('session_winrate'), format_percent(summary.get('win_rate'))),
        (translate('session_damage'), format_number(summary.get('avg_damage'))),
        (translate('session_wn8'), format_number(summary.get('wn8'))),
    ]
    lines = [font(translate('session_title'), COLOR_NEUTRAL, 15)]
    for label, value in rows:
        lines.append(u'%s: %s' % (font(label, COLOR_MUTED), font(value, COLOR_NEUTRAL)))
    recent = summary.get('recent')
    if recent:
        lines.append(_recent_line(recent, translate))

    pending = summary.get('pending')
    if pending:
        lines.append(font(translate('session_pending', count=pending), COLOR_MUTED))

    return u'\n'.join(lines)


def format_session_plain(summary, translate):
    return u'%s: %s %s, %s %s, %s %s, %s %s' % (
        translate('session_title'),
        translate('session_battles'), format_number(summary.get('battles')),
        translate('session_winrate'), format_percent(summary.get('win_rate')),
        translate('session_damage'), format_number(summary.get('avg_damage')),
        translate('session_wn8'), format_number(summary.get('wn8')),
    )
