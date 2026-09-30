# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import re

from ....core.format import COLOR_DOWN, COLOR_UP, COLOR_WARN

# The client's own ping colour bands (predefined_hosts: LOW <= 59 ms, NORM <= 119 ms, HIGH above).
PING_LOW_MS = 59
PING_NORM_MS = 119
PING_GOOD_COLOR = COLOR_UP
PING_NORM_COLOR = COLOR_WARN
PING_BAD_COLOR = COLOR_DOWN

# «Броня на сайте»: the site's 3D armour page of a tank, /t/<slug>/armor. The server makes the slug from the tank's tag
# (apps/web/server gamedata importer: @sindresorhus/slugify(tag, {decamelize: false})): lower case, '&' as 'and',
# apostrophes dropped, any other run of characters but letters and digits turned into one '-'.
ACTION_ARMOR = 'armor'
ARMOR_PATH = '/t/%s/armor'
SLUG_DROPPED = re.compile(r"['\u2019]")
SLUG_SEPARATORS = re.compile(r'[^a-z0-9]+')

# The hangar card (model/widget.py), design px.
CARD_WIDTH = 260
