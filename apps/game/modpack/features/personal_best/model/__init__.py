# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number
from ....core.templates import render
from .constants import LIVE_METRICS, MAX_TANKS, METRICS

# Fair play: the player's own records only: own battle results, the own vehicle dossier and the site's copy of them.


def clean_record(values):
    record = {}
    for metric in METRICS:
        value = (values or {}).get(metric)
        if is_int(value) and value > 0:
            record[metric] = int(value)
    return record


class RecordBook(object):
    """The best single-battle values per own tank (random battles), the largest of every source seen."""

    def __init__(self, data=None):
        self.tanks = {}
        self.order = []
        tanks = data.get('tanks') if isinstance(data, dict) else None
        for key, values in sorted((tanks or {}).items()):
            if str(key).isdigit() and isinstance(values, dict):
                self.merge(int(key), values)

    def get(self, tank_id):
        return dict(self.tanks.get(tank_id) or {})

    def merge(self, tank_id, values):
        if not is_int(tank_id) or tank_id <= 0:
            return False
        incoming = clean_record(values)
        current = self.tanks.get(tank_id)
        if current is None:
            if not incoming:
                return False
            current = self.tanks[tank_id] = {}
            self.order.append(tank_id)
            if len(self.order) > MAX_TANKS:
                self.tanks.pop(self.order.pop(0), None)
        changed = False
        for metric, value in incoming.items():
            if value > current.get(metric, 0):
                current[metric] = value
                changed = True
        return changed

    def to_dict(self):
        return {'tanks': dict((str(tank_id), dict(self.tanks[tank_id])) for tank_id in self.order if tank_id in self.tanks)}


def event_values(event):
    stats = event.get('stats') or {}
    xp = stats.get('original_xp') if is_number(stats.get('original_xp')) else stats.get('xp')
    assist = sum(stats.get(key) for key in ('damage_assisted_radio', 'damage_assisted_track') if is_number(stats.get(key)))
    return clean_record({'damage': stats.get('damage_dealt'), 'assist': assist, 'frags': stats.get('frags'), 'xp': xp})


# A tank without a known record beats nothing, so its first battle with the mod brings no card.
def beaten(record, values):
    result = []
    for metric in METRICS:
        old, new = record.get(metric), values.get(metric)
        if old and new and new > old:
            result.append((metric, old, new))
    return result


class LiveBattle(object):
    """This battle's own damage, assist and frags from the player's feedback events (and the end-of-life summary)."""

    def __init__(self):
        self.values = dict((metric, 0) for metric in LIVE_METRICS)

    def add(self, metric, amount=1):
        if metric not in self.values or not is_number(amount) or amount <= 0:
            return False
        self.values[metric] += int(amount)
        return True

    def raise_to(self, metric, value):
        if metric in self.values and is_number(value) and value > self.values[metric]:
            self.values[metric] = int(value)
            return True
        return False


def metric_values(metric, record, current, translate):
    best = record.get(metric) or 0
    return {
        'metric': translate('pb_metric_' + metric),
        'record': best,
        'current': current,
        'left': max(0, best - current),
        'over': max(0, current - best),
    }


def metric_line(values, translate, size):
    if values['over'] > 0:
        return font(translate('pb_line_beaten', **display(values)), COLOR_UP, size)
    shown = display(values)
    return u'%s %s' % (font(translate('pb_line_record', **shown), COLOR_NEUTRAL, size), font(translate('pb_line_left', **shown), COLOR_MUTED, size))


def display(values):
    return dict((key, format_number(value) if is_number(value) else value) for key, value in values.items())


def format_line(record, live, settings, translate):
    size = settings.get('font_size')
    lines = []
    for metric in LIVE_METRICS:
        if not settings.get('show_' + metric) or not record.get(metric):
            continue
        values = metric_values(metric, record, live.values.get(metric, 0), translate)
        if settings.get('template'):
            lines.append(font(render(settings.get('template'), values), COLOR_NEUTRAL, size))
        else:
            lines.append(metric_line(values, translate, size))
    return u'\n'.join(lines) if lines else None


def format_card(broken, vehicle, translate):
    parts = [translate('pb_card_part', metric=translate('pb_metric_' + metric), new=format_number(new), old=format_number(old))
             for metric, old, new in broken]
    return translate('pb_card', vehicle=vehicle or u'-', parts=u', '.join(parts))
