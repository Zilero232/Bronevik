# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.compat import is_number
from ....core.format import COLOR_MUTED, font
from .constants import (
    ARROW_LEFT,
    ARROW_RIGHT,
    BAR_CELLS,
    BAR_LEFT,
    BAR_MARK,
    BAR_RIGHT,
    BAR_TRACK,
    LIMIT_REACHED_DEG,
    TONE_COLORS,
)

# Fair play: the own gun's traverse limits (the vehicle's own parameters, VehicleDescriptor.gun.turretYawLimits) and
# the own turret's yaw. Nothing is aimed or changed, nothing about other vehicles is read.


# None for a turret that turns all the way round: it has no limits.
def arc_state(yaw, limits):
    if not is_number(yaw) or not isinstance(limits, (tuple, list)):
        return None
    if len(limits) != 2:
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


def side_tone(degrees, warn):
    if degrees < LIMIT_REACHED_DEG:
        return 'bad'
    if degrees <= warn:
        return 'warning'
    return 'text'


def side_color(degrees, warn):
    return TONE_COLORS[side_tone(degrees, warn)]


def left_label(degrees):
    return u'%s %d°' % (ARROW_LEFT, int(round(degrees)))


def right_label(degrees):
    return u'%d° %s' % (int(round(degrees)), ARROW_RIGHT)


def bar(position):
    cell = int(round(position * (BAR_CELLS - 1)))
    cells_after = BAR_CELLS - 1 - cell
    return BAR_LEFT + BAR_TRACK * cell + BAR_MARK + BAR_TRACK * cells_after + BAR_RIGHT


def format_panel(state, settings, translate):
    if state is None:
        return None
    size = settings.get('font_size')
    warn = settings.get('warn_deg')
    left = state['left']
    right = state['right']
    shows_degrees = settings.get('show_degrees')

    parts = [font(translate('gun_arc_label'), COLOR_MUTED, size)]
    if shows_degrees:
        parts.append(font(left_label(left), side_color(left, warn), size))
    if settings.get('show_bar'):
        parts.append(font(bar(state['position']), COLOR_MUTED, size))
    if shows_degrees:
        parts.append(font(right_label(right), side_color(right, warn), size))
    return u' '.join(parts)
