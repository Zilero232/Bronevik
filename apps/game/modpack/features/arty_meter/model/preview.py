from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import PREVIEW_BATTLE, PREVIEW_DAY
from .text import arty_text
from .widget import arty_widget


def preview_text(settings, translate):
    return arty_text(PREVIEW_BATTLE, PREVIEW_DAY, settings, translate)


def preview_widget(settings, translate):
    return arty_widget(PREVIEW_BATTLE, PREVIEW_DAY, settings)
