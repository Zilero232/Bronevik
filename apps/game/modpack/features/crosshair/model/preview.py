from __future__ import absolute_import, division, print_function, unicode_literals

from . import mark_html
from .widget import crosshair_widget


def preview_text(settings, translate):
    return mark_html(settings.get('mark'), settings.get('mark_size'), settings.get('mark_color'))


def preview_widget(settings, translate):
    return crosshair_widget(settings)
