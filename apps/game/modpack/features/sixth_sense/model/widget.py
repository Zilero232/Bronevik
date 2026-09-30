from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import glyph, image
from ....core.hud.widget import widget
from . import icon_path
from .constants import KIND

# Fair play: follows the client's own sixth-sense lamp (the player's vehicle is spotted); nothing about the spotter.


def lamp_icon(settings):
    path = icon_path(settings)
    return image(path, 'lamp') if path else (None if settings.get('text') else glyph('lamp'))


def sixth_sense_widget(state, settings, translate, now):
    seconds_left = state.seconds_left(now) or 0.0
    return widget(KIND, {
        'icon': lamp_icon(settings),
        'size': settings.get('icon_size'),
        'text': settings.get('text'),
        'color': settings.get('color'),
        'elapsed': round(state.duration - seconds_left, 1),
        'duration': state.duration,
        'timer': bool(settings.get('show_timer')),
        'dim': bool(state.dimmed(now)),
    })
