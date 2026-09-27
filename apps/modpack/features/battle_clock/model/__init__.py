from __future__ import absolute_import, division, print_function, unicode_literals

import math
import time

from ....core.compat import is_number, to_text
from ....core.hud import render
from ....core.panels import COLOR_NEUTRAL, font
from .constants import TIMED_PERIODS


def strftime(fmt, moment):
    if not fmt:
        return ''
    return to_text(time.strftime(str(fmt), moment))


def timer_seconds(period, period_end, server_now):
    """Seconds left in the current arena period, as the client's own battle timer counts them."""
    if period not in TIMED_PERIODS or not is_number(period_end) or not is_number(server_now) or period_end <= 0:
        return None
    return max(0, int(math.ceil(period_end - server_now)))


def format_timer(seconds):
    if seconds is None:
        return ''
    minutes, rest = divmod(int(seconds), 60)
    return '%02d:%02d' % (minutes, rest)


def clock_values(moment, settings, period=None, seconds_left=None):
    return {
        'time': strftime(settings.get('clock_format'), moment),
        'date': strftime(settings.get('date_format'), moment),
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
