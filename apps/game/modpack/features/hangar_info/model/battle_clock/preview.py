from __future__ import absolute_import, division, print_function, unicode_literals

from . import clock_values, format_battle_clock
from .constants import PREVIEW_SECONDS_LEFT
from .widget import clock_widget


def _preview_values(info, moment):
    return clock_values(moment, info, PREVIEW_SECONDS_LEFT)


def preview_text(info, moment, font_size):
    return format_battle_clock(_preview_values(info, moment), font_size)


def preview_widget(info, moment):
    return clock_widget(_preview_values(info, moment))
