from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import format_number, format_percent
from .constants import UNKNOWN_RESULT


def result_label(result, translate):
    return translate('br_result_' + (result or UNKNOWN_RESULT))


def percent_text(value):
    if value is None:
        return ''
    return format_percent(value)


def signed(value, percent=False):
    if value is None:
        return ''

    text = format_percent(value) if percent else format_number(value)

    if value > 0:
        return '+' + text
    return text
