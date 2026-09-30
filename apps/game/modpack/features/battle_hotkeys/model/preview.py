from __future__ import absolute_import, division, print_function, unicode_literals

from . import notice_text
from .constants import SERVER_AIM
from .widget import notice_widget


def preview_text(settings, translate):
    return notice_text(SERVER_AIM, True, settings, translate)


def preview_widget(settings, translate):
    return notice_widget(SERVER_AIM, True, translate)
