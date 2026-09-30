from __future__ import absolute_import, division, print_function, unicode_literals

from . import Platoon
from .constants import PREVIEW_MEMBERS, PREVIEW_OWN
from .text import points_text
from .widget import points_widget


def preview_platoon():
    platoon = Platoon()
    for vehicle_id, seen, hp, frags in PREVIEW_MEMBERS:
        platoon.add(vehicle_id, seen)
        platoon.set_health(vehicle_id, hp)
        platoon.members[vehicle_id]['frags'] = frags
    platoon.add_own('damage', PREVIEW_OWN['damage'])
    platoon.add_own('assist', PREVIEW_OWN['assist'])
    return platoon


def preview_text(settings, translate):
    return points_text(preview_platoon(), settings, translate)


def preview_widget(settings, translate):
    return points_widget(preview_platoon(), settings, translate, extended=True)
