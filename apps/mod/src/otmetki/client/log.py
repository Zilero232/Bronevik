from __future__ import absolute_import, print_function

import functools
import traceback

PREFIX = '[OTMETKI]'


def log(message):
    print('%s %s' % (PREFIX, message))


def log_exception(context):
    print('%s error in %s\n%s' % (PREFIX, context, traceback.format_exc()))


def safe(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception:
            log_exception(getattr(func, '__name__', 'handler'))
            return None
    return wrapper
