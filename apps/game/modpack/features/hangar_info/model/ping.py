from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from .constants import PING_COLORS, PING_HIGH, PING_LOW, PING_LOW_MS, PING_NORM, PING_NORM_MS, PING_TONES


def valid_ping(value):
    if not is_number(value) or value < 0:
        return None
    return int(value)


def ping_band(ping):
    if ping is None:
        return None
    if ping <= PING_LOW_MS:
        return PING_LOW
    if ping <= PING_NORM_MS:
        return PING_NORM
    return PING_HIGH


def ping_color(ping):
    return PING_COLORS[ping_band(ping)]


def ping_tone(ping):
    return PING_TONES[ping_band(ping)]
