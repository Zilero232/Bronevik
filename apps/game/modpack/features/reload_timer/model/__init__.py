# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, COLOR_WARN, font
from ....core.templates import render
from .constants import BAR_CHAR, BAR_WIDTH

# Fair play: the own gun only, what the vanilla reticle's reload indicator and ammo panel already show (allowed:
# Lesta's rule 3 concerns the reload of enemies, which is never read).


class GunState(object):

    def __init__(self):
        self.left = 0.0
        self.total = 0.0
        self.clip = 1
        self.in_clip = None

    def set_reload(self, left, total):
        left = float(left) if is_number(left) and left > 0 else 0.0
        total = float(total) if is_number(total) and total > 0 else max(self.total, left)
        changed = (left, total) != (self.left, self.total)
        self.left, self.total = left, max(total, left)
        return changed

    def set_clip(self, size):
        size = int(size) if is_int(size) and size > 0 else 1
        changed = size != self.clip
        self.clip = size
        return changed

    def set_in_clip(self, count):
        count = int(count) if is_int(count) and count >= 0 else None
        changed = count != self.in_clip
        self.in_clip = count
        return changed

    def tick(self, seconds):
        if self.left <= 0:
            return False
        self.left = max(0.0, self.left - seconds)
        return True

    def values(self):
        return {
            'left': u'%.1f' % self.left,
            'total': u'%.1f' % self.total,
            'ready': self.left <= 0,
            'clip': self.clip,
            'in_clip': self.in_clip if self.in_clip is not None else u'',
        }


def bar(left, total):
    done = int(round(BAR_WIDTH * (1 - left / total))) if total > 0 else BAR_WIDTH
    done = max(0, min(BAR_WIDTH, done))
    return font(BAR_CHAR * done, COLOR_WARN) + font(BAR_CHAR * (BAR_WIDTH - done), COLOR_MUTED)


def format_panel(gun, settings, translate):
    size = settings.get('font_size')
    values = gun.values()
    if settings.get('template'):
        return font(render(settings.get('template'), values), COLOR_NEUTRAL, size)
    lines = []
    if not values['ready']:
        line = font(translate('reload_left', **values), COLOR_WARN, size)
        if settings.get('show_bar'):
            line += u' ' + bar(gun.left, gun.total)
        lines.append(line)
    elif settings.get('show_ready'):
        lines.append(font(translate('reload_ready'), COLOR_UP, size))
    if settings.get('show_clip') and gun.clip > 1 and gun.in_clip is not None:
        lines.append(font(translate('reload_clip', **values), COLOR_NEUTRAL, size))
    return u'\n'.join(lines) if lines else None
