from __future__ import absolute_import, division, print_function, unicode_literals

import re

WORD_SEPARATORS = re.compile(r'[,;\n]+')
# Senders remembered per battle (a 30x30 battle has 30 players; commands add nothing new).
MAX_SENDERS = 64
