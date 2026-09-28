from __future__ import absolute_import, division, print_function, unicode_literals

from . import mark_html


def preview_text(settings, translate):
    return mark_html(settings.get('mark'), settings.get('mark_size'), settings.get('mark_color'))
