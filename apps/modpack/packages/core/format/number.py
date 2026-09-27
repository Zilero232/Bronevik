from ..compat import is_number
from .constants import MISSING


def format_number(value):
    """`12 345`: rounded, a space as the thousands separator; '-' when not a number."""
    if not is_number(value):
        return MISSING
    return u'{:,}'.format(int(round(value))).replace(u',', u' ')


def format_percent(value):
    if not is_number(value):
        return MISSING
    return u'%.2f%%' % value
