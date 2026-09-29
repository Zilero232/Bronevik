from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.widget import widget
from .constants import KIND

# Fair play: the own gun only, what the stock reticle's reload indicator and ammo panel already show.


def reload_widget(gun, settings):
    return widget(KIND, {
        'left': round(gun.left, 1),
        'total': round(gun.total, 1),
        'ready': gun.left <= 0,
        'clip': gun.clip,
        'in_clip': gun.in_clip,
        'show_bar': bool(settings.get('show_bar')),
        'show_ready': bool(settings.get('show_ready')),
        'show_clip': bool(settings.get('show_clip')),
    })
