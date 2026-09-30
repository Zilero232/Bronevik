from __future__ import absolute_import, division, print_function, unicode_literals

from . import arc_state, format_panel
from .constants import PREVIEW_LIMITS, PREVIEW_YAW
from .widget import panel_widget


def preview_text(settings, translate):
    state = arc_state(PREVIEW_YAW, PREVIEW_LIMITS)
    return format_panel(state, settings, translate) or u''


def preview_widget(settings, translate):
    state = arc_state(PREVIEW_YAW, PREVIEW_LIMITS)
    return panel_widget(state, settings)
