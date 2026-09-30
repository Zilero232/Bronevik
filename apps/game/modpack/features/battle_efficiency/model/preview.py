from __future__ import absolute_import, division, print_function, unicode_literals

from . import format_panel, panel_state
from .constants import PREVIEW_ROW, PREVIEW_TOTALS
from .widget import panel_widget


def preview_text(settings, translate):
    return format_panel(panel_state(dict(PREVIEW_TOTALS), PREVIEW_ROW), settings, translate) or u''


def preview_widget(settings, translate):
    return panel_widget(panel_state(dict(PREVIEW_TOTALS), PREVIEW_ROW), settings, translate)
