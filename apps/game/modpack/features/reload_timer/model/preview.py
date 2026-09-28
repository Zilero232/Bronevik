from __future__ import absolute_import, division, print_function, unicode_literals

from . import GunState, format_panel
from .constants import PREVIEW_CLIP, PREVIEW_RELOAD


def preview_gun():
    gun = GunState()
    gun.set_reload(*PREVIEW_RELOAD)
    gun.set_clip(PREVIEW_CLIP[0])
    gun.set_in_clip(PREVIEW_CLIP[1])
    return gun


def preview_text(settings, translate):
    return format_panel(preview_gun(), settings, translate) or u''
