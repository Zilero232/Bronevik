from __future__ import absolute_import, division, print_function, unicode_literals

from . import clean_devices, format_panel
from .constants import PREVIEW_DEVICES
from .widget import equipment_widget


def preview_text(settings, translate):
    return format_panel(clean_devices(PREVIEW_DEVICES), settings)


def preview_widget(settings, translate):
    return equipment_widget(clean_devices(PREVIEW_DEVICES), settings)
