from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_DOWN, COLOR_UP, COLOR_WARN

# The client's own ping colour bands (predefined_hosts: LOW <= 59 ms, NORM <= 119 ms, HIGH above).
PING_LOW_MS = 59
PING_NORM_MS = 119
PING_GOOD_COLOR = COLOR_UP
PING_NORM_COLOR = COLOR_WARN
PING_BAD_COLOR = COLOR_DOWN
