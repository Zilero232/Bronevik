"""The points of a shot the client draws on a vehicle (`Vehicle.showDamageFromShot`), decoded. Pure.

Fair play: the callers read only the shots on the player's own tank, as the client receives them to draw the hit
effects on it. A point says where on the own tank the shot landed, never where the shooter was."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import is_int
from ..vendor import attr
from .constants import BYTE, BYTE_MASK, END_SHIFTS, PART_SHIFT, START_SHIFTS

__all__ = ('ShotPoint', 'decode_segment', 'drawn_points')


@attr.s(frozen=True)
class ShotPoint(object):
    """One decoded point: the tank `part` index, the hit effect `code` and its `start` / `end`, fractions (0..1) of
    the part's bounding box along x, y and z."""

    part = attr.ib()
    code = attr.ib()
    start = attr.ib()
    end = attr.ib()

    def has_length(self):
        return self.start != self.end


def _byte_at(segment, shift):
    return (segment >> shift) & BYTE_MASK


def decode_segment(segment):
    """The ShotPoint packed in `segment`, or None for anything but a non-negative int."""
    if not is_int(segment) or segment < 0:
        return None
    start = tuple(_byte_at(segment, shift) / BYTE for shift in START_SHIFTS)
    end = tuple(_byte_at(segment, shift) / BYTE for shift in END_SHIFTS)
    return ShotPoint(_byte_at(segment, PART_SHIFT), _byte_at(segment, 0), start, end)


def drawn_points(segments):
    """The points of a shot the client draws an effect for, in order: decodable and with a length (the client skips a
    point without one). The last of them is where the shot's hit effect plays."""
    points = [decode_segment(segment) for segment in segments or ()]
    return [point for point in points if point is not None and point.has_length()]
