from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number
from ....core.format import COLOR_NEUTRAL, font, format_moment, format_timer
from ....core.templates import render
from .constants import TIMED_PERIODS


def timer_seconds(period, period_end, server_now):
    if period not in TIMED_PERIODS:
        return None
    if not is_number(period_end) or not is_number(server_now) or period_end <= 0:
        return None
    # RU 1.45 client source: the stock battle timer shows max(int(end - BigWorld.serverTime()), 0), the seconds
    # truncated (gui/battle_control/controllers/period_ctrl.py ArenaPeriodController.__tick).
    return max(0, int(period_end - server_now))


def clock_values(moment, settings, period=None, seconds_left=None):
    return {
        'time': format_moment(settings.get('clock_format'), moment),
        'date': format_moment(settings.get('date_format'), moment),
        'timer': _timer_text(settings, seconds_left),
        'period': period or '',
    }


def _timer_text(settings, seconds_left):
    if not settings.get('show_timer'):
        return ''
    return format_timer(seconds_left)


def format_battle_clock(values, settings, translate):
    if settings.get('template'):
        template = settings.get('template')
    elif values['timer']:
        template = translate('clock_template_timer')
    else:
        template = translate('clock_template')
    text = render(template, values).strip()
    return font(text, COLOR_NEUTRAL, settings.get('font_size'))
