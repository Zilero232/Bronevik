from __future__ import absolute_import, division, print_function, unicode_literals

from . import format_panel, values
from .constants import PREVIEW_ENEMY_HP, PREVIEW_ENEMY_MAX, PREVIEW_OWN_DAMAGE
from .widget import panel_widget


def preview_text(settings, translate):
    return format_panel(values(PREVIEW_OWN_DAMAGE, PREVIEW_ENEMY_MAX, PREVIEW_ENEMY_HP), settings, translate)


def preview_widget(settings, translate):
    return panel_widget(values(PREVIEW_OWN_DAMAGE, PREVIEW_ENEMY_MAX, PREVIEW_ENEMY_HP), settings, translate)
