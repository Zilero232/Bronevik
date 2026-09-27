from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font
from ....core.shells import SHELL_CODES
from ....core.templates import render
from .constants import MAX_ENTRIES, MERGE_WINDOW_S, OUTCOMES


class HitLog(object):

    def __init__(self):
        self.entries = []
        self.counts = dict((outcome, 0) for outcome in OUTCOMES)
        self.damage = 0
        self.crits = 0

    def _latest(self, target_id, now, pending=None):
        for entry in reversed(self.entries):
            if entry['target'] != target_id:
                continue
            if now - entry['time'] > MERGE_WINDOW_S:
                return None
            if pending is None or entry[pending] is None:
                return entry
        return None

    def _append(self, target_id, outcome, now, vehicle):
        entry = {
            'target': target_id,
            'vehicle': to_text(vehicle) if vehicle else None,
            'outcome': outcome,
            'damage': None,
            'shell': None,
            'crits': 0,
            'hp': None,
            'time': now,
        }
        self.entries.append(entry)
        self.counts[outcome] += 1
        del self.entries[:-MAX_ENTRIES]
        return entry

    def add_result(self, target_id, outcome, now, vehicle=None):
        if outcome not in OUTCOMES or not is_int(target_id):
            return False
        self._append(target_id, outcome, now, vehicle)
        return True

    def add_damage(self, target_id, amount, now, vehicle=None, shell=None):
        if not is_int(target_id) or not is_number(amount) or amount <= 0:
            return False
        entry = self._latest(target_id, now, pending='damage') or self._append(target_id, 'pen', now, vehicle)
        entry['damage'] = int(amount)
        entry['shell'] = shell if shell in SHELL_CODES else None
        if vehicle and not entry['vehicle']:
            entry['vehicle'] = to_text(vehicle)
        self.damage += int(amount)
        return True

    def add_crits(self, target_id, count, now):
        if not is_int(count) or count <= 0:
            return False
        entry = self._latest(target_id, now)
        if entry is None:
            return False
        entry['crits'] += count
        self.crits += count
        return True

    def set_health(self, target_id, health, now):
        if not is_number(health):
            return False
        entry = self._latest(target_id, now, pending='hp')
        if entry is None:
            return False
        entry['hp'] = max(0, int(health))
        return True

    def values(self):
        counts = self.counts
        return {
            'hits': sum(counts.values()),
            'pens': counts['pen'] + counts['crit'],
            'no_pens': counts['no_pen'] + counts['spaced'] + counts['tracks'] + counts['missed_armor'],
            'ricochets': counts['ricochet'],
            'damage': self.damage,
            'crits': self.crits,
        }

    def recent(self, limit):
        if limit <= 0:
            return []
        return list(reversed(self.entries[-limit:]))

    def by_target(self, limit):
        order = []
        groups = {}
        for entry in self.entries:
            group = groups.get(entry['target'])
            if group is None:
                group = groups[entry['target']] = {'target': entry['target'], 'vehicle': None, 'hits': 0, 'damage': 0, 'crits': 0,
                                                   'hp': None, 'outcome': None, 'shell': None}
            else:
                order.remove(entry['target'])
            order.append(entry['target'])
            group['hits'] += 1
            group['damage'] += entry['damage'] or 0
            group['crits'] += entry['crits']
            group['outcome'] = entry['outcome']
            group['vehicle'] = entry['vehicle'] or group['vehicle']
            group['hp'] = entry['hp'] if entry['hp'] is not None else group['hp']
        if limit <= 0:
            return []
        return [groups[target] for target in reversed(order[-limit:])]


def line_values(entry, translate, index):
    return {
        'index': index,
        'vehicle': entry.get('vehicle') or '',
        'outcome': translate('hlog_outcome_' + entry['outcome']),
        'damage': entry.get('damage') or '',
        'crits': entry.get('crits') or '',
        'hp': entry.get('hp'),
        'hits': entry.get('hits', 1),
        'shell': translate('hlog_shell_' + entry['shell']) if entry.get('shell') else '',
    }


def format_hit_log(log, settings, translate):
    size = settings.get('font_size')
    lines = []
    header = settings.get('header_template') or translate('hlog_header_template')
    if settings.get('show_header'):
        lines.append(font(render(header, log.values()), COLOR_NEUTRAL, size))
    grouped = settings.get('group_by_target')
    rows = log.by_target(settings.get('lines')) if grouped else log.recent(settings.get('lines'))
    template = settings.get('line_template') or translate('hlog_target_template' if grouped else 'hlog_line_template')
    for index, entry in enumerate(rows):
        text = render(template, line_values(entry, translate, index + 1)).strip()
        lines.append(font(text, COLOR_MUTED, max(8, size - 2)))
    return '\n'.join(lines)
