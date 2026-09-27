from __future__ import absolute_import, division, print_function, unicode_literals

from . import SixthSense, format_sixth_sense
from .constants import PREVIEW_ELAPSED_S


def preview_text(settings, translate):
    lamp = SixthSense()
    lamp.observed(True, 0.0)
    return format_sixth_sense(lamp, settings, translate, float(PREVIEW_ELAPSED_S))
