from __future__ import absolute_import, division, print_function, unicode_literals

from . import LiveBattle, format_line
from .constants import PREVIEW_LIVE, PREVIEW_RECORD
from .widget import line_widget


def preview_live():
    live = LiveBattle()
    for metric, value in PREVIEW_LIVE.items():
        live.add(metric, value)
    return live


def preview_text(settings, translate):
    return format_line(PREVIEW_RECORD, preview_live(), settings, translate) or u''


def preview_widget(settings, translate):
    return line_widget(PREVIEW_RECORD, preview_live(), settings, translate)
