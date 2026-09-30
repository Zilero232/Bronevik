# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.battle_tally import Counters
from ....core.compat import is_int, is_number
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, format_number
from ....core.templates import render
from .constants import ASSIST_STATS, LIVE_METRICS, MAX_TANKS, METRICS

# Fair play: the player's own records only: own battle results, the own vehicle dossier and the site's copy of them.


def clean_record(values):
    known = values or {}
    record = {}
    for metric in METRICS:
        value = known.get(metric)
        if is_int(value) and value > 0:
            record[metric] = int(value)
    return record


def saved_tanks(data):
    tanks = data.get('tanks')
    if isinstance(tanks, dict):
        return tanks

    return {}


def saved_order(data):
    order = data.get('order')
    if isinstance(order, list):
        return order

    return []


# The saved order first (least recently seen first), then the tanks the order misses.
def load_order(data, tanks):
    keys = [str(tank_id) for tank_id in saved_order(data) if str(tank_id) in tanks]
    keys.extend(sorted(key for key in tanks if key not in keys))
    return keys


def raise_record(current, incoming):
    is_changed = False
    for metric, value in incoming.items():
        if value > current.get(metric, 0):
            current[metric] = value
            is_changed = True
    return is_changed


# The best single-battle values per own tank (random battles), the largest of every source seen. Past MAX_TANKS the tank
# seen least recently is dropped; the order is kept in the file.
class RecordBook(object):

    def __init__(self, data=None):
        self.tanks = {}
        self.order = []

        saved = data if isinstance(data, dict) else {}
        tanks = saved_tanks(saved)
        for key in load_order(saved, tanks):
            if str(key).isdigit() and isinstance(tanks[key], dict):
                self.merge(int(key), tanks[key])

    def get(self, tank_id):
        return dict(self.tanks.get(tank_id) or {})

    def _touch(self, tank_id):
        if tank_id in self.order:
            self.order.remove(tank_id)
        self.order.append(tank_id)

    def _drop_least_recent(self):
        while len(self.order) > MAX_TANKS:
            self.tanks.pop(self.order.pop(0), None)

    def merge(self, tank_id, values):
        if not is_int(tank_id) or tank_id <= 0:
            return False
        incoming = clean_record(values)
        if not incoming:
            return False

        current = self.tanks.setdefault(tank_id, {})
        self._touch(tank_id)
        self._drop_least_recent()
        return raise_record(current, incoming)

    def to_dict(self):
        order = [tank_id for tank_id in self.order if tank_id in self.tanks]
        tanks = dict((str(tank_id), dict(self.tanks[tank_id])) for tank_id in order)
        return {'tanks': tanks, 'order': order}


def event_values(event):
    stats = event.get('stats') or {}

    xp = stats.get('original_xp')
    if not is_number(xp):
        xp = stats.get('xp')
    assist = sum(stats.get(key) for key in ASSIST_STATS if is_number(stats.get(key)))

    return clean_record({'damage': stats.get('damage_dealt'), 'assist': assist, 'frags': stats.get('frags'), 'xp': xp})


# A tank without a known record beats nothing, so its first battle with the mod brings no card.
def beaten(record, values):
    result = []
    for metric in METRICS:
        old = record.get(metric)
        new = values.get(metric)
        if old and new and new > old:
            result.append((metric, old, new))
    return result


class LiveBattle(Counters):

    def __init__(self):
        Counters.__init__(self, LIVE_METRICS)


def shown_metrics(record, settings):
    return [metric for metric in LIVE_METRICS if settings.get('show_' + metric) and record.get(metric)]


def metric_values(metric, record, current, translate):
    best = record.get(metric) or 0
    return {
        'metric': translate('pb_metric_' + metric),
        'record': best,
        'current': current,
        'left': max(0, best - current),
        'over': max(0, current - best),
    }


def display(values):
    return dict((key, format_number(value) if is_number(value) else value) for key, value in values.items())


def metric_line(values, translate, size):
    shown = display(values)
    if values['over'] > 0:
        return font(translate('pb_line_beaten', **shown), COLOR_UP, size)

    record = font(translate('pb_line_record', **shown), COLOR_NEUTRAL, size)
    left = font(translate('pb_line_left', **shown), COLOR_MUTED, size)
    return u'%s %s' % (record, left)


def metric_text(values, settings, translate):
    size = settings.get('font_size')
    template = settings.get('template')
    if template:
        return font(render(template, values), COLOR_NEUTRAL, size)

    return metric_line(values, translate, size)


def format_line(record, live, settings, translate):
    lines = []
    for metric in shown_metrics(record, settings):
        values = metric_values(metric, record, live.values.get(metric, 0), translate)
        lines.append(metric_text(values, settings, translate))

    if not lines:
        return None
    return u'\n'.join(lines)


def card_part(broken_record, translate):
    metric, old, new = broken_record
    return translate(
        'pb_card_part',
        metric=translate('pb_metric_' + metric),
        new=format_number(new),
        old=format_number(old),
    )


def format_card(broken, vehicle, translate):
    parts = [card_part(broken_record, translate) for broken_record in broken]
    return translate('pb_card', vehicle=vehicle or u'-', parts=u', '.join(parts))
