from __future__ import absolute_import, division, print_function, unicode_literals

KINDS = ('damage', 'radio', 'track', 'stun', 'blocked', 'received')
MAX_ENTRIES = 50

LOG_KIND_FILTER = {
    'all': KINDS,
    'dealt': ('damage', 'radio', 'track', 'stun', 'blocked'),
    'received': ('received',),
}

PREVIEW_ENTRIES = (
    ('damage', 390, 'Pz. IV', 'ap'),
    ('radio', 480, None, None),
    ('damage', 320, 'T-34', 'apcr'),
    ('blocked', 240, 'IS', 'heat'),
    ('received', 310, 'KV-1', 'he'),
)
PREVIEW_SIZE = (280, 130)
