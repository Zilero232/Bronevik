from __future__ import absolute_import, division, print_function, unicode_literals

from . import format_card
from .constants import PREVIEW_CARD
from .widget import card_widget


def preview_text(settings, translate):
    return format_card(dict(PREVIEW_CARD), settings, translate) or u''


def preview_widget(settings, translate):
    return card_widget(dict(PREVIEW_CARD), settings, translate)
