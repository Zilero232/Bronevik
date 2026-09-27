# -*- coding: utf-8 -*-
"""Panel text in the GUIFlash HTML subset: shared colours and number formats."""
from .compat import is_number, to_text

COLOR_UP = '#7CD35B'
COLOR_DOWN = '#E3564A'
COLOR_NEUTRAL = '#F2EAD3'
COLOR_MUTED = '#A09A8B'


def font(text, color, size=None):
    if size:
        return u'<font color="%s" size="%d">%s</font>' % (color, size, to_text(text))
    return u'<font color="%s">%s</font>' % (color, to_text(text))


def format_number(value):
    if not is_number(value):
        return u'-'
    return u'{:,}'.format(int(round(value))).replace(u',', u' ')


def format_percent(value):
    if not is_number(value):
        return u'-'
    return u'%.2f%%' % value
