from __future__ import absolute_import, division, print_function, unicode_literals

import re

MAGIC = 0x11343212
MAX_BLOCKS = 16
MAX_HEADER_BLOCK_BYTES = 16 * 1024 * 1024
EXTENSIONS = ('.mtreplay', '.wotreplay')
# The recording in progress (BattleReplay.record, RU 1.45 :339-342): temp.mtreplay, or temp1..temp99 when that one is taken.
RECORDING_NAME = re.compile(r'^temp\d{0,2}\.(mt|wot)replay$')
HEAD_FORMAT = str('<II')
SIZE_FORMAT = str('<I')
DATE_TIME = re.compile(r'^\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*$')
AVATAR_KEY = 'avatar'
RESULT_WIN = 'win'
RESULT_LOSS = 'loss'
RESULT_DRAW = 'draw'
