from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font
from ....core.shells import SHELL_CODES
from ....core.templates import render
from .constants import KINDS, LOG_KIND_FILTER, MAX_ENTRIES


class DamageLog(object):

    def __init__(self):
        self.totals = dict((kind, 0) for kind in KINDS)
        self.counts = dict((kind, 0) for kind in KINDS)
        self.summary = {}
        self.entries = []

    def add(self, kind, amount, vehicle=None, shell=None):
        if kind not in KINDS or not is_number(amount) or amount <= 0:
            return False
        amount = int(amount)
        self.totals[kind] += amount
        self.counts[kind] += 1
        self.entries.append({
            'kind': kind,
            'amount': amount,
            'vehicle': to_text(vehicle) if vehicle else None,
            'shell': shell if shell in SHELL_CODES else None,
        })
        del self.entries[:-MAX_ENTRIES]
        return True

    def apply_summary(self, damage=None, assist=None, blocked=None, stun=None):
        changed = False
        for key, value in (('damage', damage), ('assist', assist), ('blocked', blocked), ('stun', stun)):
            if is_number(value) and value >= 0 and self.summary.get(key) != int(value):
                self.summary[key] = int(value)
                changed = True
        return changed

    def values(self):
        totals = self.totals
        summary = self.summary
        stun = max(totals['stun'], summary.get('stun', 0))
        radio_track = max(totals['radio'] + totals['track'], summary.get('assist', 0))
        return {
            'dealt': max(totals['damage'], summary.get('damage', 0)),
            'blocked': max(totals['blocked'], summary.get('blocked', 0)),
            'assisted': radio_track + stun,
            'assist_radio': totals['radio'],
            'assist_track': totals['track'],
            'assist_stun': stun,
            'received': totals['received'],
            'hits': self.counts['damage'],
            'blocked_hits': self.counts['blocked'],
            'received_hits': self.counts['received'],
        }

    def recent(self, limit, kinds=KINDS):
        if limit <= 0:
            return []
        picked = [entry for entry in self.entries if entry['kind'] in kinds]
        return list(reversed(picked[-limit:]))


def totals_template(settings, translate):
    style = settings.get('style')
    if style == 'custom':
        return settings.get('template')
    return translate('dlog_template_' + style)


def entry_values(entry, translate, index):
    return {
        'index': index,
        'amount': entry['amount'],
        'kind': translate('dlog_kind_' + entry['kind']),
        'vehicle': entry.get('vehicle') or '',
        'shell': translate('dlog_shell_' + entry['shell']) if entry.get('shell') else '',
    }


def format_damage_log(log, settings, translate):
    size = settings.get('font_size')
    lines = [font(render(totals_template(settings, translate), log.values()), COLOR_NEUTRAL, size)]
    if settings.get('show_log'):
        kinds = LOG_KIND_FILTER.get(settings.get('log_kinds'), KINDS)
        template = settings.get('entry_template') or translate('dlog_entry_template')
        for index, entry in enumerate(log.recent(settings.get('log_lines'), kinds)):
            text = render(template, entry_values(entry, translate, index + 1)).strip()
            lines.append(font(text, COLOR_MUTED, max(8, size - 2)))
    return '\n'.join(lines)
