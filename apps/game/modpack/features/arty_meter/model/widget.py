from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import glyph
from ....core.hud.widget import widget
from .constants import KIND, SCALE


def _day(day, settings):
    if not settings.get('show_day') or not day:
        return None
    return {'battles': day['battles'], 'total': day['hits'] + day['splash'], 'damage': day['damage']}


def arty_widget(battle, day, settings):
    values = dict(battle)
    values['total'] = values.get('total', values['hits'] + values['splash'])
    return widget(KIND, {
        'battle': values,
        'day': _day(day, settings),
        'scale': SCALE,
        'icon': glyph('arty'),
    })
