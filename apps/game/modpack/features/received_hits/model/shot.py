from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int
from .constants import CODE_MASK, END_SHIFTS, RICOCHET_CODES, START_SHIFTS


def hit_code(segment):
    """The hit effect code of one encoded point, or None when the point has no length (the client skips those)."""
    if not is_int(segment) or segment < 0:
        return None
    start = tuple((segment >> shift) & CODE_MASK for shift in START_SHIFTS)
    end = tuple((segment >> shift) & CODE_MASK for shift in END_SHIFTS)
    return segment & CODE_MASK if start != end else None


def is_ricochet(points):
    """True when the shot's last point, the one the client draws the effect for, is a ricochet."""
    codes = [code for code in (hit_code(segment) for segment in points or ()) if code is not None]
    return bool(codes) and codes[-1] in RICOCHET_CODES
