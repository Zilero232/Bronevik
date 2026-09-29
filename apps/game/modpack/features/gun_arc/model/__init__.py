# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.compat import is_number
from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_NEUTRAL, COLOR_WARN, font
from .constants import ARROW_LEFT, ARROW_RIGHT, BAR_CELLS, BAR_LEFT, BAR_MARK, BAR_RIGHT, BAR_TRACK

# Fair play: the own gun's traverse limits (the vehicle's own parameters, VehicleDescriptor.gun.turretYawLimits) and the
# own turret's yaw. Nothing is aimed or changed, nothing about other vehicles is read.


def arc_state(yaw, limits):
    """Degrees left to each limit, or None for a turret that turns all the way round (no limits)."""
    if not is_number(yaw) or not isinstance(limits, (tuple, list)) or len(limits) != 2:
        return None
    low, high = limits
    if not is_number(low) or not is_number(high) or high <= low:
        return None
    # UNVERIFIED on Lesta 1.45: a negative yaw is to the left (the lower limit comes first).
    yaw = min(high, max(low, yaw))
    return {
        'left': math.degrees(yaw - low),
        'right': math.degrees(high - yaw),
        'position': (yaw - low) / (high - low),
    }


def side_color(degrees, warn):
    if degrees < 0.5:
        return COLOR_DOWN
    if degrees <= warn:
        return COLOR_WARN
    return COLOR_NEUTRAL


def bar(position):
    cell = int(round(position * (BAR_CELLS - 1)))
    return BAR_LEFT + BAR_TRACK * cell + BAR_MARK + BAR_TRACK * (BAR_CELLS - 1 - cell) + BAR_RIGHT


def format_panel(state, settings, translate):
    if state is None:
        return None
    size = settings.get('font_size')
    warn = settings.get('warn_deg')
    left, right = state['left'], state['right']
    parts = [font(translate('gun_arc_label'), COLOR_MUTED, size)]
    if settings.get('show_degrees'):
        parts.append(font(u'%s %d°' % (ARROW_LEFT, int(round(left))), side_color(left, warn), size))
    if settings.get('show_bar'):
        parts.append(font(bar(state['position']), COLOR_MUTED, size))
    if settings.get('show_degrees'):
        parts.append(font(u'%d° %s' % (int(round(right)), ARROW_RIGHT), side_color(right, warn), size))
    return u' '.join(parts)
