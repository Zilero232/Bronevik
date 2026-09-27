import time

from ..compat import to_text
from .constants import DATE_TIME_FORMAT


def format_moment(fmt, moment):
    """`time.strftime` as text; '' for an empty format (a switched-off clock or date)."""
    if not fmt:
        return u''
    return to_text(time.strftime(str(fmt), moment))


def format_epoch(epoch, fmt=DATE_TIME_FORMAT):
    """Epoch seconds on the local clock (`dd.mm.YYYY HH:MM` by default), or None."""
    if epoch is None:
        return None
    return format_moment(fmt, time.localtime(epoch))


def format_timer(seconds):
    """`mm:ss` of a countdown; '' when there is none."""
    if seconds is None:
        return u''
    minutes, rest = divmod(int(seconds), 60)
    return u'%02d:%02d' % (minutes, rest)
