from __future__ import absolute_import, division, print_function, unicode_literals

import re

COLOR_UP = '#7CD35B'
COLOR_DOWN = '#E3564A'
COLOR_NEUTRAL = '#F2EAD3'
COLOR_MUTED = '#A09A8B'
COLOR_WARN = '#F2B25B'

MISSING = u'-'
DATE_TIME_FORMAT = '%d.%m.%Y %H:%M'

TAGS = re.compile(r'<[^>]*>')
SPACES = re.compile(r'\s+')
