from __future__ import absolute_import, division, print_function, unicode_literals

from . import clock_values, format_battle_clock
from .constants import PREVIEW_PERIOD, PREVIEW_SECONDS_LEFT
from .widget import clock_widget


def _preview_values(settings, moment):
    return clock_values(moment, settings, PREVIEW_PERIOD, PREVIEW_SECONDS_LEFT)


def preview_text(settings, translate, moment):
    return format_battle_clock(_preview_values(settings, moment), settings, translate)


def preview_widget(settings, moment):
    return clock_widget(_preview_values(settings, moment), settings)
