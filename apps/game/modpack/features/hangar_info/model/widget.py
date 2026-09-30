from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import glyph
from ....core.hud.widget import widget
from .constants import STRIP_KIND
from .ping import ping_tone


def _shown(settings, key, value):
    return value if settings.get(key) else u''


def strip_widget(values, settings, ping, translate):
    online = _shown(settings, 'show_online', values['online'])
    return widget(STRIP_KIND, {
        'icon': glyph('clock'),
        'time': values['time'],
        'date': values['date'],
        'server': _shown(settings, 'show_server', values['server']),
        'ping_icon': glyph('ping'),
        'ping': _shown(settings, 'show_ping', values['ping']),
        'ping_tone': ping_tone(ping),
        'online_label': translate('hangar_info_online_label') if online else u'',
        'online': online,
    })
