from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.moe import ThresholdCurve
from . import format_panel, panel_state
from .constants import PREVIEW_COMBINED, PREVIEW_PACE, PREVIEW_SNAPSHOT, PREVIEW_THRESHOLDS


def preview_text(settings, translate):
    state = panel_state(PREVIEW_SNAPSHOT, PREVIEW_COMBINED, ThresholdCurve.from_api(PREVIEW_THRESHOLDS), PREVIEW_PACE, settings)
    return format_panel(state, settings, translate)
