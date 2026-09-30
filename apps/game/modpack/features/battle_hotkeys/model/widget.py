from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.widget import widget
from . import option_name, state_name
from .constants import KIND


def notice_widget(option, value, translate):
    return widget(KIND, {
        'option': option_name(option, translate),
        'state': state_name(value, translate),
        'tone': 'good' if value else 'bad',
    })
