from __future__ import absolute_import, division, print_function, unicode_literals

from . import clean_missions, format_battle
from .constants import PREVIEW_MISSIONS
from .widget import battle_widget


def preview_text(settings, translate):
    return format_battle(clean_missions(PREVIEW_MISSIONS)[0], 'mediumTank', settings, translate) or u''


def preview_widget(settings, translate):
    return battle_widget(clean_missions(PREVIEW_MISSIONS)[0], 'mediumTank', settings, translate)
