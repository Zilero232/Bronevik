"""The mod's log lines in python.log and in its own file (`open_file`, `LogFile`). Messages are written as the
interpreter's native `str`, so a Python 2 traceback holding non-ASCII bytes (a Cyrillic game path) never breaks the
logger itself."""
from __future__ import absolute_import, division, print_function, unicode_literals

import functools
import time
import traceback

from ..compat import to_native
from .constants import PREFIX
from .limiter import RepeatLimiter
from .logfile import LogFile

_repeats = RepeatLimiter(time.time)
_file = LogFile()


def _line(*parts):
    return to_native(' ').join(to_native(part) for part in parts)


def _emit(text):
    print(text)
    _file.write(text)


def open_file(path, header):
    """Starts this session's own log file at `path` with the `header` lines; the lines logged before are kept for it."""
    return _file.open(path, [_line(PREFIX, line) for line in header])


def log(message):
    _emit(_line(PREFIX, message))


def log_exception(context):
    """Logs the current exception with its traceback. An identical one (same context and traceback) is
    written once per REPEAT_WINDOW_S; the next one written says how many were held back in between."""
    trace = traceback.format_exc()
    write, suppressed = _repeats.admit((to_native(context), trace))
    if not write:
        return
    lines = [_line(PREFIX, 'error in', context)]
    if suppressed:
        lines.append(_line(PREFIX, 'the same error repeated %d more times' % suppressed))
    lines.append(to_native(trace))
    _emit(to_native('\n').join(lines))


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
