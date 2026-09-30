from __future__ import absolute_import, division, print_function, unicode_literals

from . import format_battle
from .constants import PREVIEW_DAMAGE, PREVIEW_GOALS
from .widget import battle_widget


def preview_text(settings, translate):
    goals = [dict(goal) for goal in PREVIEW_GOALS]
    return format_battle(goals, None, PREVIEW_DAMAGE, settings, translate) or u''


def preview_widget(settings, translate):
    goals = [dict(goal) for goal in PREVIEW_GOALS]
    return battle_widget(goals, None, PREVIEW_DAMAGE, settings, translate)
