from __future__ import absolute_import, division, print_function, unicode_literals

from . import clean_loadout, format_panel
from .constants import PREVIEW_LOADOUT


def preview_text(settings, translate):
    return format_panel(clean_loadout(PREVIEW_LOADOUT), settings, translate) or u''
