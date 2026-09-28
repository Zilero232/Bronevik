from __future__ import absolute_import, division, print_function, unicode_literals

from . import LiveBattle, format_line
from .constants import PREVIEW_LIVE, PREVIEW_RECORD


def preview_text(settings, translate):
    live = LiveBattle()
    for metric, value in PREVIEW_LIVE.items():
        live.add(metric, value)
    return format_line(PREVIEW_RECORD, live, settings, translate) or u''
