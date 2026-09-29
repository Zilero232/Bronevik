from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int
from .constants import BYTE, END_SHIFTS, FRONT_Z, OUTCOME_BY_CODE, PART_NAMES, REAR_Z, SIDED_PARTS, START_SHIFTS

# Fair play: these are the points of the shots that hit the player's own tank, as the client itself receives them to draw
# the hit effects on it (Vehicle.showDamageFromShot). Nothing here says where the shooter was.


def decode_segment(segment):
    """(part index, hit effect code, start, end) of one encoded point; start and end are fractions of the part's box."""
    if not is_int(segment) or segment < 0:
        return None
    start = tuple(((segment >> shift) & 0xFF) / BYTE for shift in START_SHIFTS)
    end = tuple(((segment >> shift) & 0xFF) / BYTE for shift in END_SHIFTS)
    return (segment >> 8) & 0xFF, segment & 0xFF, start, end


def part_of(index):
    return PART_NAMES[index] if 0 <= index < len(PART_NAMES) else PART_NAMES[0]


def impact(segments):
    """(part, outcome, (x, y, z)) of a shot: the last decodable point, the one the client draws the effect for."""
    found = None
    for segment in segments or ():
        decoded = decode_segment(segment)
        if decoded is None:
            continue
        index, code, start, end = decoded
        if start == end or code not in OUTCOME_BY_CODE:
            continue
        found = (part_of(index), OUTCOME_BY_CODE[code], tuple(round((a + b) / 2.0, 3) for a, b in zip(start, end)))
    return found


def side_of(part, x, z):
    # UNVERIFIED on Lesta 1.45: +z is the front of the part and +x its right side (the BigWorld model axes).
    if part not in SIDED_PARTS:
        return None
    if z >= FRONT_Z:
        return 'front'
    if z <= REAR_Z:
        return 'rear'
    return 'left' if x < 0.5 else 'right'
