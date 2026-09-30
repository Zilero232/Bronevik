from __future__ import absolute_import, division, print_function, unicode_literals

from .armor import format_armor
from .constants import PREVIEW_READOUT
from .widget import armor_widget


def preview_text(settings, translate):
    return format_armor(dict(PREVIEW_READOUT), settings, translate) or u''


def preview_widget(settings, translate):
    return armor_widget(dict(PREVIEW_READOUT), settings, translate)
