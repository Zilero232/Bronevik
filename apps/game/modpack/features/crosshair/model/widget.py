from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import image
from ....core.hud.widget import widget
from . import mark_image
from .constants import KIND


# The settings previews only: in battle the panel sends the mark alone, the game draws its own reticle under it.
def crosshair_widget(settings):
    path = mark_image(settings.get('mark'), settings.get('mark_size'), settings.get('mark_color'))
    return widget(KIND, {
        'mark': image(path) if path else None,
        'size': settings.get('mark_size'),
        'hides_centre': bool(path) and bool(settings.get('mark_hides_centre')),
    })
