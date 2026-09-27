from __future__ import absolute_import, division, print_function, unicode_literals

KINDS = ('damage', 'radio', 'track', 'stun', 'blocked', 'received')
MAX_ENTRIES = 50

LOG_KIND_FILTER = {
    'all': KINDS,
    'dealt': ('damage', 'radio', 'track', 'stun', 'blocked'),
    'received': ('received',),
}
