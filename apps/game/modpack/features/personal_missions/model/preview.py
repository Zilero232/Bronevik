from __future__ import absolute_import, division, print_function, unicode_literals

from . import clean_missions, format_battle
from .constants import PREVIEW_MISSIONS, PREVIEW_VEHICLE_CLASS
from .widget import battle_widget


def _preview_missions():
    missions, _totals = clean_missions(PREVIEW_MISSIONS)
    return missions


def preview_text(settings, translate):
    return format_battle(_preview_missions(), PREVIEW_VEHICLE_CLASS, settings, translate) or u''


def preview_widget(settings, translate):
    return battle_widget(_preview_missions(), PREVIEW_VEHICLE_CLASS, settings, translate)
