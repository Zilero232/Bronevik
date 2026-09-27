from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.compat import is_number
from ....core.format import COLOR_NEUTRAL, font, format_moment, format_timer
from ....core.templates import render
from .constants import TIMED_PERIODS


def timer_seconds(period, period_end, server_now):
    if period not in TIMED_PERIODS or not is_number(period_end) or not is_number(server_now) or period_end <= 0:
        return None
    return max(0, int(math.ceil(period_end - server_now)))


def clock_values(moment, settings, period=None, seconds_left=None):
    return {
        'time': format_moment(settings.get('clock_format'), moment),
        'date': format_moment(settings.get('date_format'), moment),
        'timer': format_timer(seconds_left) if settings.get('show_timer') else '',
        'period': period or '',
    }


def format_battle_clock(values, settings, translate):
    if settings.get('template'):
        template = settings.get('template')
    elif values['timer']:
        template = translate('clock_template_timer')
    else:
        template = translate('clock_template')
    text = render(template, values).strip()
    return font(text, COLOR_NEUTRAL, settings.get('font_size'))
