from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.moe import ThresholdCurve
from . import format_panel, panel_state
from .constants import PREVIEW_COMBINED, PREVIEW_PACE, PREVIEW_SNAPSHOT, PREVIEW_THRESHOLDS
from .widget import marks_widget


def preview_state(settings):
    return panel_state(PREVIEW_SNAPSHOT, PREVIEW_COMBINED, ThresholdCurve.from_api(PREVIEW_THRESHOLDS), PREVIEW_PACE, settings)


def preview_text(settings, translate):
    return format_panel(preview_state(settings), settings, translate)


def preview_widget(settings, translate):
    return marks_widget(preview_state(settings), settings, translate)
