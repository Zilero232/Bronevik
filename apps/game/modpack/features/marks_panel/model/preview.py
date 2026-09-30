from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.moe import ThresholdCurve
from . import PanelView, format_panel, panel_state
from .constants import PREVIEW_COMBINED, PREVIEW_PACE, PREVIEW_SNAPSHOT, PREVIEW_THRESHOLDS
from .widget import marks_widget


def preview_state(settings):
    curve = ThresholdCurve.from_api(PREVIEW_THRESHOLDS)
    return panel_state(PREVIEW_SNAPSHOT, PREVIEW_COMBINED, curve, PREVIEW_PACE, settings)


def preview_text(settings, translate):
    view = PanelView(settings)
    return format_panel(preview_state(view), view, translate)


def preview_widget(settings, translate):
    view = PanelView(settings)
    return marks_widget(preview_state(view), view, translate)
