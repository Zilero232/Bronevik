from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_number
from ....core.shells import SHELL_CODES
from ....core.templates import render
from .constants import (
    DAMAGE_OUTCOMES,
    DETAIL_EXTENDED,
    DETAIL_FULL,
    DETAIL_SHORT,
    LINE_TEMPLATES,
    MAX_ENTRIES,
    MERGE_WINDOW_S,
    MIN_LINE_FONT_SIZE,
    OUTCOME_COLORS,
    OUTCOMES,
)


def _awaits_damage(entry):
    return entry['damage'] is None and entry['outcome'] in DAMAGE_OUTCOMES


def _awaits_health(entry):
    return entry['hp'] is None


def _positive_int(value):
    if is_number(value) and value > 0:
        return int(value)
    return None


def _name_once(entry, vehicle):
    if vehicle and not entry['vehicle']:
        entry['vehicle'] = to_text(vehicle)


def _new_group(target_id):
    return {
        'target': target_id,
        'vehicle': None,
        'hits': 0,
        'damage': 0,
        'crits': 0,
        'hp': None,
        'outcome': None,
        'shell': None,
    }


def _add_to_group(group, entry):
    group['hits'] += 1
    group['damage'] += entry['damage'] or 0
    group['crits'] += entry['crits']
    group['outcome'] = entry['outcome']
    group['vehicle'] = entry['vehicle'] or group['vehicle']
    if entry['hp'] is not None:
        group['hp'] = entry['hp']


class HitLog(object):

    def __init__(self):
        self.entries = []
        self.counts = dict((outcome, 0) for outcome in OUTCOMES)
        self.damage = 0
        self.crits = 0
        self.targets = {}

    # The class and max HP of a target as its marker and the player panels show them.
    def describe(self, target_id, vehicle_class=None, max_hp=None):
        if not is_int(target_id):
            return False

        self.targets[target_id] = {'class': vehicle_class, 'max': _positive_int(max_hp)}
        return True

    def _latest(self, target_id, now, accepts=None):
        for entry in reversed(self.entries):
            if entry['target'] != target_id:
                continue
            if now - entry['time'] > MERGE_WINDOW_S:
                return None
            if accepts is None or accepts(entry):
                return entry
        return None

    def _append(self, target_id, outcome, now, vehicle, marked=True):
        entry = {
            'target': target_id,
            'vehicle': to_text(vehicle) if vehicle else None,
            'outcome': outcome,
            'damage': None,
            'shell': None,
            'crits': 0,
            'hp': None,
            'marked': marked,
            'time': now,
        }
        self.entries.append(entry)
        self.counts[outcome] += 1
        del self.entries[:-MAX_ENTRIES]
        return entry

    # The battle event with the damage (batched by the server, BATTLE_EVENTS_PROCESSING_TIMEOUT 0.2 s) may come
    # before the hit marker of the same shot: the marker then only names the outcome of that entry.
    def add_result(self, target_id, outcome, now, vehicle=None):
        if outcome not in OUTCOMES or not is_int(target_id):
            return False

        entry = self._latest(target_id, now)
        if entry is None or entry['marked']:
            self._append(target_id, outcome, now, vehicle)
            return True

        self.counts[entry['outcome']] -= 1
        self.counts[outcome] += 1
        entry['outcome'] = outcome
        entry['marked'] = True
        _name_once(entry, vehicle)
        return True

    def add_damage(self, target_id, amount, now, vehicle=None, shell=None):
        damage = _positive_int(amount)
        if not is_int(target_id) or damage is None:
            return False

        entry = self._latest(target_id, now, _awaits_damage)
        if entry is None:
            entry = self._append(target_id, 'pen', now, vehicle, marked=False)

        entry['damage'] = damage
        entry['shell'] = shell if shell in SHELL_CODES else None
        _name_once(entry, vehicle)
        self.damage += damage
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

        entry = self._latest(target_id, now, _awaits_health)
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
        if limit <= 0:
            return []

        groups = {}
        order = []
        for entry in self.entries:
            target_id = entry['target']
            if target_id in groups:
                order.remove(target_id)
            else:
                groups[target_id] = _new_group(target_id)
            order.append(target_id)
            _add_to_group(groups[target_id], entry)

        latest_first = [groups[target_id] for target_id in reversed(order)]
        return latest_first[:limit]


# VEHICLE_HEALTH fires for any health change of a visible vehicle; its payload is (newHealth, attackerInfo,
# attackReasonID) (RU 1.45 feedback_adaptor._setVehicleHealthChanged). Only the player's own hit may set "HP left".
def own_shot_health(value, own_vehicle_id):
    if not isinstance(value, (list, tuple)) or len(value) < 2 or own_vehicle_id is None:
        return None

    health, attacker = value[0], value[1]
    if getattr(attacker, 'vehicleID', None) != own_vehicle_id:
        return None

    return health


def outcome_color(outcome, palette):
    if outcome not in OUTCOMES:
        return COLOR_MUTED

    colors = OUTCOME_COLORS.get(palette, OUTCOME_COLORS['classic'])
    return colors[OUTCOMES.index(outcome)]


def crits_text(count, translate):
    if not count:
        return ''

    return translate('hlog_crits', count=count)


def hp_left_text(hp, translate):
    if hp is None:
        return ''

    return translate('hlog_hp_left', hp=format_number(hp))


def line_values(entry, translate, index, palette=None):
    shell = entry.get('shell')
    return {
        'c_outcome': outcome_color(entry.get('outcome'), palette),
        'index': index,
        'vehicle': entry.get('vehicle') or '',
        'outcome': translate('hlog_outcome_' + entry['outcome']),
        'damage': entry.get('damage') or '',
        'crits': entry.get('crits') or '',
        'hp': entry.get('hp'),
        'hits': entry.get('hits', 1),
        'shell': translate('hlog_shell_' + shell) if shell else '',
        'crits_text': crits_text(entry.get('crits'), translate),
        'hp_left': hp_left_text(entry.get('hp'), translate),
    }


def detail_mode(settings, extended):
    if not settings.get('alt_mode'):
        return DETAIL_FULL

    return DETAIL_EXTENDED if extended else DETAIL_SHORT


def line_template(settings, translate, detail):
    custom_key, per_shot_key, grouped_key = LINE_TEMPLATES[detail]
    built_in_key = grouped_key if settings.get('group_by_target') else per_shot_key
    return settings.get(custom_key) or translate(built_in_key)


def line_note(entry, translate, detail):
    if detail != DETAIL_EXTENDED:
        return ''

    item = line_values(entry, translate, 1)
    words = (item['shell'], item['crits_text'])
    return ' '.join(word for word in words if word)


def log_rows(log, settings):
    lines = settings.get('lines')
    if settings.get('group_by_target'):
        return log.by_target(lines)

    return log.recent(lines)


def format_hit_log(log, settings, translate, extended=False):
    size = settings.get('font_size')
    line_size = max(MIN_LINE_FONT_SIZE, size - 2)
    template = line_template(settings, translate, detail_mode(settings, extended))
    palette = settings.get('palette')

    lines = []
    if settings.get('show_header'):
        header = settings.get('header_template') or translate('hlog_header_template')
        lines.append(font(render(header, log.values()), COLOR_NEUTRAL, size))
    for index, entry in enumerate(log_rows(log, settings)):
        text = render(template, line_values(entry, translate, index + 1, palette)).strip()
        lines.append(font(text, COLOR_MUTED, line_size))
    return '\n'.join(lines)
