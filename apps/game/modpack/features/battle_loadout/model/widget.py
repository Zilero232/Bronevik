from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.widget import widget
from . import icon_size
from .constants import CELL_FRAME, KIND, STOCK_ICON, STOCK_PITCH


def equipment_widget(devices, settings):
    size = icon_size(settings)
    data = {
        'size': size,
        'cell': size + CELL_FRAME,
        'gap': STOCK_PITCH - STOCK_ICON - CELL_FRAME,
        'items': devices,
    }
    return widget(KIND, data)
