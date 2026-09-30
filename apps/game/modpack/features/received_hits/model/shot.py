from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.shot_points import drawn_points
from .constants import RICOCHET_CODES


# The shot's last drawn point is the one the client plays the hit effect for.
def is_ricochet(points):
    drawn = drawn_points(points)
    if not drawn:
        return False
    return drawn[-1].code in RICOCHET_CODES
