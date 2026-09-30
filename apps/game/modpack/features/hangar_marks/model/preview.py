from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.moe import ThresholdCurve
from . import format_panel, hangar_state
from .constants import PREVIEW_PACE, PREVIEW_SNAPSHOT, PREVIEW_THRESHOLDS
from .widget import hangar_widget


def preview_text(settings, translate):
    return format_panel(hangar_state(PREVIEW_SNAPSHOT, ThresholdCurve.from_api(PREVIEW_THRESHOLDS), PREVIEW_PACE), settings, translate)


def preview_state():
    return hangar_state(PREVIEW_SNAPSHOT, ThresholdCurve.from_api(PREVIEW_THRESHOLDS), PREVIEW_PACE)


def preview_widget(settings, translate):
    return hangar_widget(preview_state(), settings, translate)
