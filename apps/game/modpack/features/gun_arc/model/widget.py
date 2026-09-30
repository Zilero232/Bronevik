# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.widget import widget
from . import side_tone, yaw_label
from .constants import DEGREES, KIND


def _degrees(value, settings):
    return DEGREES % int(round(value)) if settings.get('show_degrees') else u''


def panel_widget(state, settings):
    if state is None:
        return None
    warn = settings.get('warn_deg')
    left = state['left']
    right = state['right']
    return widget(KIND, {
        'scale': bool(settings.get('show_bar')),
        'position': round(state['position'], 3),
        'centre': round(state['centre'], 3),
        'left': _degrees(left, settings),
        'right': _degrees(right, settings),
        'left_tone': side_tone(left, warn),
        'right_tone': side_tone(right, warn),
        'gun_tone': side_tone(min(left, right), warn),
        'yaw': yaw_label(state['yaw']) if settings.get('show_yaw') else u'',
    })
