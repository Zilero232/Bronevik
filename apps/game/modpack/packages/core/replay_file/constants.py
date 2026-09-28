from __future__ import absolute_import, division, print_function, unicode_literals

import re

MAGIC = 0x11343212
MAX_BLOCKS = 16
MAX_HEADER_BLOCK_BYTES = 16 * 1024 * 1024
EXTENSIONS = ('.mtreplay', '.wotreplay')
RECORDING_NAMES = ('temp.wotreplay', 'temp.mtreplay')
HEAD_FORMAT = str('<II')
SIZE_FORMAT = str('<I')
DATE_TIME = re.compile(r'^\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*$')
AVATAR_KEY = 'avatar'
RESULT_WIN = 'win'
RESULT_LOSS = 'loss'
RESULT_DRAW = 'draw'
