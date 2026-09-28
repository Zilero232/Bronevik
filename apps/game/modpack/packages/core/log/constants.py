from __future__ import absolute_import, division, print_function, unicode_literals

PREFIX = '[OTMETKI]'
# A handler that starts failing on every battle event (hundreds of calls a minute after a client patch)
# writes its traceback once per window, then one line with the count of the identical ones held back.
REPEAT_WINDOW_S = 60.0
MAX_TRACKED_ERRORS = 200
