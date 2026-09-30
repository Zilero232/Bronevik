from __future__ import absolute_import, division, print_function, unicode_literals

from . import clean_missions, format_hangar
from .constants import PREVIEW_MISSIONS
from .widget import hangar_widget


def _preview_missions():
    return clean_missions(PREVIEW_MISSIONS)


def preview_text(settings, translate):
    missions, totals = _preview_missions()
    return format_hangar(missions, settings, translate, totals) or u''


def preview_widget(settings, translate):
    missions, totals = _preview_missions()
    return hangar_widget(missions, settings, translate, totals)
