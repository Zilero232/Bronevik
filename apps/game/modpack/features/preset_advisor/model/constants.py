from __future__ import absolute_import, division, print_function, unicode_literals

# The site's public read (apps/web/server builds module): the most picked equipment, directives and consumables of the
# tank's random-battle top-10 % cohort, as compact descriptors (the client's intCD).
ADVICE_PATH = '/tanks/%d/build-advice'
KINDS = ('equipment', 'directives', 'consumables')
PAYLOAD_VERSION = 1

# The server caches the read for 10 minutes and the aggregate changes once a day.
CACHE_TTL_S = 6 * 60 * 60
RETRY_AFTER_S = 10 * 60
HTTP_OK = 200
