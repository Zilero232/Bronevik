from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from .constants import FIGURE, FIGURE_ORDER


def _fraction(value):
    return min(1.0, max(0.0, float(value))) if is_number(value) else 0.5


def figure_point(entry):
    """Where a hit sits on the schematic: its part's rectangle, the point's x across it and z from the back up."""
    x, z = _fraction(entry.get('x')), _fraction(entry.get('z'))
    part = entry.get('part')
    if part == 'chassis':
        key = 'chassis_left' if x < 0.5 else 'chassis_right'
        x = x * 2 if x < 0.5 else (x - 0.5) * 2
    else:
        key = part if part in FIGURE else 'hull'
    left, top, width, height = FIGURE[key]
    return round(left + x * width, 3), round(top + (1.0 - z) * height, 3)


def figure_of(battle):
    shapes = [dict(zip(('x', 'y', 'w', 'h'), FIGURE[key])) for key in FIGURE_ORDER]
    marks = []
    for entry in battle.get('hits') or []:
        x, y = figure_point(entry)
        marks.append({'x': x, 'y': y, 'tone': entry.get('outcome')})
    return {'shapes': shapes, 'marks': marks}
