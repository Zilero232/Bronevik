from __future__ import absolute_import, division, print_function, unicode_literals

import os

from ....core.replay_file import is_replay_name, read_header
from .constants import SCAN_MAX_FILES


class HeaderCache(object):

    def __init__(self, read=None):
        self.read = read or read_header
        self.entries = {}

    def get(self, path, size, mtime):
        cached = self.entries.get(path)
        if cached is not None and cached[0] == (size, mtime):
            return cached[1]
        header = self.read(path)
        self.entries[path] = ((size, mtime), header)
        return header

    def forget(self, path):
        self.entries.pop(path, None)


def own_replays(folder, account_id, cache, listdir=None, stat=None):
    if account_id is None:
        return []
    listdir = listdir or os.listdir
    stat = stat or os.stat
    try:
        names = listdir(folder)
    except (IOError, OSError):
        return []
    found = []
    for name in names:
        if not is_replay_name(name):
            continue
        path = os.path.join(folder, name)
        try:
            info = stat(path)
        except (IOError, OSError):
            continue
        found.append((info.st_mtime, info.st_size, name, path))
    found.sort(reverse=True)
    replays = []
    for mtime, size, name, path in found[:SCAN_MAX_FILES]:
        header = cache.get(path, size, mtime)
        if header and header.get('player_id') is not None and int(header['player_id']) == int(account_id):
            replays.append({'name': name, 'path': path, 'size': size, 'mtime': mtime, 'header': header})
    return replays


def find_own(replays, name):
    for replay in replays:
        if replay['name'] == name:
            return replay
    return None
