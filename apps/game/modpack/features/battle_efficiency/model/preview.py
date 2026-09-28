from __future__ import absolute_import, division, print_function, unicode_literals

from . import format_panel, panel_state
from .constants import PREVIEW_ROW, PREVIEW_TOTALS


def preview_text(settings, translate):
    return format_panel(panel_state(dict(PREVIEW_TOTALS), PREVIEW_ROW), settings, translate) or u''
