# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.classes import class_key
from ....core.compat import is_int, is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_number
from ....core.shells import SHELL_CODES
from ....core.templates import render
from ....core.vendor import attr
from .constants import BLOCKING, MAX_ENTRIES, MERGE_WINDOW_S, MINUS, OUTCOME_COLORS, OUTCOMES, SEPARATOR, TOTAL_KEYS

# Fair play: the hits on the player's own tank from the player's own feedback (what the vanilla damage log and
# ribbons show). The attacker is the one the damage panel already names; nothing about positions or aim.


@attr.s
class Hit(object):

    attacker = attr.ib(default=None)
    vehicle_class = attr.ib(default=None)
    shell = attr.ib(default=None)
    damage = attr.ib(default=0)
    crits = attr.ib(default=0)
    at = attr.ib(default=None)
    source = attr.ib(default=None)


def _known_shell(shell):
    return shell if shell in SHELL_CODES else None


def _positive_int(value, is_valid):
    if is_valid(value) and value > 0:
        return int(value)
    return 0


def _is_outside_window(entry, at):
    return entry['at'] is None or abs(at - entry['at']) > MERGE_WINDOW_S


class ReceivedHits(object):

    def __init__(self):
        self.entries = []
        self.totals = dict((key, 0) for key in TOTAL_KEYS)

    def add(self, outcome, hit):
        if outcome not in OUTCOMES:
            return False

        damage = _positive_int(hit.damage, is_number)
        crits = _positive_int(hit.crits, is_int)
        attacker = to_text(hit.attacker) if hit.attacker else None
        if outcome == 'crit' and self._merge_crits(attacker, crits, hit.at):
            return True
        if outcome == 'blocked' and self._join_ricochet(hit.source, hit.shell, damage, hit.at):
            return True

        self.entries.append({
            'outcome': outcome,
            'attacker': attacker,
            'class': class_key(hit.vehicle_class),
            'shell': _known_shell(hit.shell),
            'damage': damage,
            'crits': crits,
            'at': hit.at,
            'source': hit.source,
            'pending': False,
        })
        del self.entries[:-MAX_ENTRIES]
        self._count(outcome, damage)
        return True

    def _count(self, outcome, damage):
        self.totals['hits'] += 1
        self.totals[outcome] += 1
        if outcome == 'pen':
            self.totals['damage'] += damage
        elif outcome in BLOCKING:
            self.totals['blocked_damage'] += damage

    # The drawn ricochet and the feedback's TANKING arrive in either order: a ricochet turns that attacker's blocked
    # line, or stands as a pending line that the blocked damage joins when it comes later.
    def ricochet(self, source, attacker=None, vehicle_class=None, at=None):
        if source is None:
            return False

        entry = self._recent(source, 'blocked', at)
        if entry is not None:
            entry['outcome'] = 'ricochet'
            self.totals['blocked'] -= 1
            self.totals['ricochet'] += 1
            return True

        self.add('ricochet', Hit(attacker=attacker, vehicle_class=vehicle_class, at=at, source=source))
        self.entries[-1]['pending'] = True
        return True

    def _join_ricochet(self, source, shell, damage, at):
        entry = self._recent(source, 'ricochet', at, pending=True)
        if entry is None:
            return False

        entry['pending'] = False
        entry['shell'] = _known_shell(shell)
        entry['damage'] = damage
        self.totals['blocked_damage'] += damage
        return True

    def _recent(self, source, outcome, at, pending=False):
        if source is None or at is None:
            return None
        for entry in reversed(self.entries):
            if _is_outside_window(entry, at):
                return None
            is_same_hit = entry['source'] == source and entry['outcome'] == outcome
            if is_same_hit and entry['pending'] == pending:
                return entry
        return None

    def _merge_crits(self, attacker, crits, at):
        if at is None:
            return False
        for entry in reversed(self.entries):
            if entry['at'] is None or at - entry['at'] > MERGE_WINDOW_S:
                return False
            if entry['outcome'] == 'pen' and entry['attacker'] == attacker:
                entry['crits'] += max(crits, 1)
                self.totals['crit'] += 1
                return True
        return False

    def recent(self, limit):
        if limit <= 0:
            return []
        return list(reversed(self.entries[-limit:]))


def _translated(translate, prefix, key):
    return translate(prefix + key) if key else u''


def entry_values(entry, translate):
    return {
        'attacker': entry['attacker'] or u'?',
        'class': _translated(translate, 'received_hits_class_', entry['class']),
        'shell': _translated(translate, 'received_hits_shell_', entry['shell']),
        'outcome': translate('received_hits_outcome_' + entry['outcome']),
        'damage': entry['damage'],
        'crits': entry['crits'],
    }


def result_text(entry, values, translate):
    if entry['outcome'] == 'pen':
        text = MINUS + format_number(entry['damage'])
        if not entry['crits']:
            return text
        return text + u' ' + translate('received_hits_with_crits', crits=entry['crits'])

    if entry['damage'] and entry['outcome'] in BLOCKING:
        damage = format_number(entry['damage'])
        return translate('received_hits_blocked_amount', outcome=values['outcome'], damage=damage)
    return values['outcome']


def entry_line(entry, settings, translate, size):
    values = entry_values(entry, translate)
    color = OUTCOME_COLORS[entry['outcome']]
    template = settings.get('line_template')
    if template:
        return font(render(template, values), color, size)

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
