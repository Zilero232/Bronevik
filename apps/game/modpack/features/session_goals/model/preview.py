from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import PREVIEW_DAMAGE, PREVIEW_GOALS
from .text import format_battle
from .widget import battle_widget


def preview_goals():
    return [dict(goal) for goal in PREVIEW_GOALS]


def preview_text(settings, translate):
    return format_battle(preview_goals(), None, PREVIEW_DAMAGE, settings, translate) or u''


def preview_widget(settings, translate):
    return battle_widget(preview_goals(), None, PREVIEW_DAMAGE, settings, translate)
