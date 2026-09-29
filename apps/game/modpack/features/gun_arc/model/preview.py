from __future__ import absolute_import, division, print_function, unicode_literals

from . import arc_state, format_panel
from .constants import PREVIEW_LIMITS, PREVIEW_YAW


def preview_text(settings, translate):
    return format_panel(arc_state(PREVIEW_YAW, PREVIEW_LIMITS), settings, translate) or u''
