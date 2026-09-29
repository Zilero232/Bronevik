from __future__ import absolute_import, division, print_function, unicode_literals

from . import SixthSense, format_sixth_sense
from .constants import PREVIEW_ELAPSED_S
from .widget import sixth_sense_widget


def preview_lamp():
    lamp = SixthSense()
    lamp.observed(True, 0.0)
    return lamp


def preview_text(settings, translate):
    return format_sixth_sense(preview_lamp(), settings, translate, float(PREVIEW_ELAPSED_S))


def preview_widget(settings, translate):
    return sixth_sense_widget(preview_lamp(), settings, translate, float(PREVIEW_ELAPSED_S))
