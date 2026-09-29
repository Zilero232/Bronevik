from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import glyph
from ....core.hud.widget import widget
from .constants import KIND, SCALE


def arty_widget(battle, day, settings):
    values = dict(battle)
    values['total'] = values.get('total', values['hits'] + values['splash'])
    return widget(KIND, {
        'battle': values,
        'day': {'battles': day['battles'], 'total': day['hits'] + day['splash'], 'damage': day['damage']} if settings.get('show_day') and day else None,
        'scale': SCALE,
        'icon': glyph('arty'),
    })
