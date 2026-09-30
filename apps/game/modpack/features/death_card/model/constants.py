# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math

# The shot and the module damage the client reported this close before the death belong to the killing blow.
SHOT_WINDOW_S = 3.0
MODULE_WINDOW_S = 1.5
MAX_MODULES = 6
# RU 1.45 client source: the damage panel's device names (VEHICLE_VIEW_STATE.DEVICES) and the states it colours.
MODULES = ('engine', 'ammoBay', 'fuelTank', 'radio', 'gun', 'turretRotator', 'surveyingDevice', 'leftTrack', 'rightTrack', 'wheel',
           'commander', 'driver', 'radioman', 'gunner', 'loader')
MODULE_STATES = ('critical', 'destroyed')
SOURCES = ('shot', 'fire', 'ram', 'world')
# Eight sectors around the hull, clockwise from the front, as the game's own hit indicator points.
SECTORS = ('front', 'front_right', 'right', 'rear_right', 'rear', 'rear_left', 'left', 'front_left')
SECTOR_ARROWS = (u'↑', u'↗', u'→', u'↘', u'↓', u'↙', u'←', u'↖')
FULL_TURN = 2 * math.pi

PREVIEW_SIZE = (360, 90)
PREVIEW_CARD = {
    'attacker': 'Pz. IV',
    'class': 'medium',
    'shell': 'ap',
    'damage': 390,
    'source': 'shot',
    'modules': ['engine', 'ammoBay'],
    'sector': 'rear_left',
}

# The card (model/widget.py), design px.
CARD_WIDTH = 300
MINUS = u'\u2212'
