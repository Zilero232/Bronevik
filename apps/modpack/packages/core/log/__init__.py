"""The mod's log lines in python.log. Messages are written as the interpreter's native `str`, so a Python 2
traceback holding non-ASCII bytes (a Cyrillic game path) never breaks the logger itself."""
from __future__ import absolute_import, division, print_function, unicode_literals

import functools
import traceback

from ..compat import to_native
from .constants import PREFIX


def _line(*parts):
    return to_native(' ').join(to_native(part) for part in parts)


def log(message):
    print(_line(PREFIX, message))


def log_exception(context):
    print(to_native('\n').join((_line(PREFIX, 'error in', context), to_native(traceback.format_exc()))))


def safe(func):
    """Decorate a handler the client or a callback calls: an exception is logged, the call returns None."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception:
            log_exception(getattr(func, '__name__', 'handler'))
            return None
    return wrapper
