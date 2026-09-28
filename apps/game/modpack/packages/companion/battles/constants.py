from __future__ import absolute_import, division, print_function, unicode_literals

# Only the on-disk cache is read (see client/results.py), so a look costs a file check and no request.
RESULTS_POLL_EVERY_S = 10.0
RESULTS_POLL_ATTEMPTS = 30
SEEN_ARENAS_LIMIT = 200
# Arenas of this session whose results the game may still post later (the player opens them from the
# notification centre); older ones are left alone.
PLAYED_ARENAS_LIMIT = 20
