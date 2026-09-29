from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import glyph
from ....core.hud.widget import widget
from .constants import KIND


def clock_widget(values, settings):
    return widget(KIND, {
        'time': values['time'],
        'date': values['date'],
        'timer': values['timer'],
        'big_timer': bool(settings.get('replace_timer')),
        'icon': glyph('clock'),
    })
