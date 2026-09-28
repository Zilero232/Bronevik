from __future__ import absolute_import, division, print_function, unicode_literals

from . import clean_missions, format_battle
from .constants import PREVIEW_MISSIONS


def preview_text(settings, translate):
    return format_battle(clean_missions(PREVIEW_MISSIONS), 'mediumTank', settings, translate) or u''
