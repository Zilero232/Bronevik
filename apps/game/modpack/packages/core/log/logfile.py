from __future__ import absolute_import, division, print_function, unicode_literals

import os
import time

from ..compat import to_bytes
from .constants import FILE_KEEP, FILE_MAX_BYTES, FILE_PENDING_LINES


def _stamp(now):
    return '%s.%03d' % (time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(now)), int(now * 1000) % 1000)


def _older(path, index):
    root, extension = os.path.splitext(path)
    return '%s.%d%s' % (root, index, extension)


def rotate(path, keep=FILE_KEEP):
    for index in range(keep - 1, 0, -1):
        source = path if index == 1 else _older(path, index - 1)
        target = _older(path, index)
        if not os.path.isfile(source):
            continue
        if os.path.isfile(target):
            os.remove(target)
        os.rename(source, target)


# The mod's own log that outlives the client's python.log: every line stamped with the local time, appended and closed
# at once (a crash loses nothing written), one file per session (`open` starts it and shifts the older ones, `keep` in
# all), a session past `max_bytes` shifted too. Lines written before `open` are held (up to `pending_lines`) and written
# after the header; a disk error stops the file, never the caller.
class LogFile(object):

    def __init__(self, clock=time.time, keep=FILE_KEEP, max_bytes=FILE_MAX_BYTES, pending_lines=FILE_PENDING_LINES):
        self.clock = clock
        self.keep = keep
        self.max_bytes = max_bytes
        self.pending_lines = pending_lines
        self.path = None
        self.pending = []
        self.size = 0
        self.failed = False

    def open(self, path, header):
        if self.path is not None or self.failed:
            return False
        try:
            folder = os.path.dirname(path)
            if folder and not os.path.isdir(folder):
                os.makedirs(folder)
            rotate(path, self.keep)
        except (IOError, OSError):
            self.failed = True
            return False
        self.path = path
        pending, self.pending = self.pending, []
        self._append([self._stamped(line) for line in header] + pending)
        return not self.failed

    def write(self, line):
        if self.failed:
            return
        stamped = self._stamped(line)
        if self.path is None:
            if len(self.pending) < self.pending_lines:
                self.pending.append(stamped)
            return
        self._append([stamped])

    def _stamped(self, line):
        text = line.decode('utf-8', 'replace') if isinstance(line, bytes) else line
        return to_bytes('%s %s' % (_stamp(self.clock()), text))

    def _append(self, lines):
        data = b''.join(line + b'\n' for line in lines)
        try:
            if self.size and self.size + len(data) > self.max_bytes:
                rotate(self.path, self.keep)
                self.size = 0
            with open(self.path, 'ab') as handle:
                handle.write(data)
        except (IOError, OSError):
            self.failed = True
            return
        self.size += len(data)
