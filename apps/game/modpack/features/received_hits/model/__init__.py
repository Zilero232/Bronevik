# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.classes import class_key
from ....core.compat import is_int, is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_number
from ....core.shells import SHELL_CODES
from ....core.templates import render
from .constants import MAX_ENTRIES, MERGE_WINDOW_S, MINUS, OUTCOME_COLORS, OUTCOMES, SEPARATOR

# Fair play: the hits on the player's own tank from the player's own feedback (what the vanilla damage log and
# ribbons show). The attacker is the one the damage panel already names; nothing about positions or aim.

TOTAL_KEYS = ('hits', 'pen', 'crit', 'blocked', 'ricochet', 'damage', 'blocked_damage')


class ReceivedHits(object):

    def __init__(self):
        self.entries = []
        self.totals = dict((key, 0) for key in TOTAL_KEYS)

    def add(self, outcome, attacker=None, vehicle_class=None, shell=None, damage=0, crits=0, at=None, source=None):
        if outcome not in OUTCOMES:
            return False
        damage = int(damage) if is_number(damage) and damage > 0 else 0
        crits = int(crits) if is_int(crits) and crits > 0 else 0
        attacker = to_text(attacker) if attacker else None
        if outcome == 'crit' and self._merge_crits(attacker, crits, at):
            return True
        if outcome == 'blocked' and self._join_ricochet(source, shell, damage, at):
            return True
        self.entries.append({
            'outcome': outcome,
            'attacker': attacker,
            'class': class_key(vehicle_class),
            'shell': shell if shell in SHELL_CODES else None,
            'damage': damage,
            'crits': crits,
            'at': at,
            'source': source,
            'pending': False,
        })
        del self.entries[:-MAX_ENTRIES]
        self.totals['hits'] += 1
        self.totals[outcome] += 1
        if outcome == 'pen':
            self.totals['damage'] += damage
        elif outcome in ('blocked', 'ricochet'):
            self.totals['blocked_damage'] += damage
        return True

    def ricochet(self, source, attacker=None, vehicle_class=None, at=None):
        """A ricochet the client drew on the own tank: it turns that attacker's blocked line from the own feedback
        into a ricochet, or stands as its own line that the feedback's blocked damage joins when it comes later."""
        if source is None:
            return False
        entry = self._recent(source, 'blocked', at)
        if entry is not None:
            entry['outcome'] = 'ricochet'
            self.totals['blocked'] -= 1
            self.totals['ricochet'] += 1
            return True
        self.add('ricochet', attacker, vehicle_class, None, 0, 0, at, source)
        self.entries[-1]['pending'] = True
        return True

    def _join_ricochet(self, source, shell, damage, at):
        entry = self._recent(source, 'ricochet', at, pending=True)
        if entry is None:
            return False
        entry['pending'] = False
        entry['shell'] = shell if shell in SHELL_CODES else None
        entry['damage'] = damage
        self.totals['blocked_damage'] += damage
        return True

    def _recent(self, source, outcome, at, pending=False):
        if source is None or at is None:
            return None
        for entry in reversed(self.entries):
            if entry['at'] is None or abs(at - entry['at']) > MERGE_WINDOW_S:
                return None
            if entry['source'] == source and entry['outcome'] == outcome and entry['pending'] == pending:
                return entry
        return None

    def _merge_crits(self, attacker, crits, at):
        for entry in reversed(self.entries):
            if at is None or entry['at'] is None or at - entry['at'] > MERGE_WINDOW_S:
                return False
            if entry['outcome'] == 'pen' and entry['attacker'] == attacker:
                entry['crits'] += max(crits, 1)
                self.totals['crit'] += 1
                return True
        return False

    def recent(self, limit):
        return list(reversed(self.entries[-limit:])) if limit > 0 else []


def entry_values(entry, translate):
    return {
        'attacker': entry['attacker'] or u'?',
        'class': translate('received_hits_class_' + entry['class']) if entry['class'] else u'',
        'shell': translate('received_hits_shell_' + entry['shell']) if entry['shell'] else u'',
        'outcome': translate('received_hits_outcome_' + entry['outcome']),
        'damage': entry['damage'],
        'crits': entry['crits'],
    }


def result_text(entry, values, translate):
    if entry['outcome'] == 'pen':
        text = MINUS + format_number(entry['damage'])
        return text + u' ' + translate('received_hits_with_crits', crits=entry['crits']) if entry['crits'] else text
    if entry['damage'] and entry['outcome'] in ('blocked', 'ricochet'):
        return translate('received_hits_blocked_amount', outcome=values['outcome'], damage=format_number(entry['damage']))
    return values['outcome']


def entry_line(entry, settings, translate, size):
    values = entry_values(entry, translate)
    color = OUTCOME_COLORS[entry['outcome']]
    if settings.get('line_template'):
        return font(render(settings.get('line_template'), values), color, size)
    who = values['attacker']
    if settings.get('show_class') and values['class']:
        who = u'%s %s' % (values['class'], who)
    parts = [font(who, COLOR_NEUTRAL, size)]
    if settings.get('show_shell') and values['shell']:
        parts.append(font(values['shell'], COLOR_MUTED, size))
    parts.append(font(result_text(entry, values, translate), color, size))
    return SEPARATOR.join(parts)


def format_panel(hits, settings, translate):
    size = settings.get('font_size')
    lines = []
    if settings.get('show_header') and hits.totals['hits']:
        shown = dict((key, format_number(value)) for key, value in hits.totals.items())
        lines.append(font(translate('received_hits_header', **shown), COLOR_NEUTRAL, size))
    lines.extend(entry_line(entry, settings, translate, size) for entry in hits.recent(settings.get('lines')))
    return u'\n'.join(lines) if lines else None
