from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.widget import widget
from .constants import KIND


def equipment_widget(devices, badges, settings):
    return widget(KIND, {'size': settings.get('icon_size'), 'items': devices, 'sets': badges})
