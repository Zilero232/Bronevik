from __future__ import absolute_import, division, print_function, unicode_literals

import os

from ....core.compat import is_number, string_types, to_text
from ....core.replay_file import is_replay_name, read_header
from .constants import INDEX_BUDGET_S, LIBRARY_VERSION, SCAN_MAX_FILES


def _stamp(size, mtime):
    return [int(size), round(float(mtime), 3)]


class ReplayLibrary(object):
    """The headers of the replays in the client's folder, read once per file version and kept on disk, so the list
    opens at once; new or changed files are read a slice of time at a time."""

    def __init__(self, store, read=None):
        self.store = store
        self.read = read or read_header
        self.entries = {}
        self.files = {}
        self.pending = []
        self.dirty = False
        self.scanned = False
        data = store.read({}) if store is not None else {}
        if isinstance(data, dict) and data.get('v') == LIBRARY_VERSION and isinstance(data.get('files'), dict):
            for name, entry in data['files'].items():
                if isinstance(name, string_types) and isinstance(entry, dict) and isinstance(entry.get('stamp'), list):
                    header = entry.get('header')
                    self.entries[to_text(name)] = {'stamp': entry['stamp'], 'header': header if isinstance(header, dict) else None}

    def scan(self, folder, listdir=None, stat=None):
        listdir = listdir or os.listdir
        stat = stat or os.stat
        try:
            names = listdir(folder)
        except (IOError, OSError):
            names = []
        found = []
        for name in names:
            if not is_replay_name(name):
                continue
            path = os.path.join(folder, name)
            try:
                info = stat(path)
            except (IOError, OSError):
                continue
            if is_number(info.st_size) and is_number(info.st_mtime):
                found.append((info.st_mtime, info.st_size, to_text(name), path))
        found.sort(reverse=True)
        self.files = {}
        for mtime, size, name, path in found[:SCAN_MAX_FILES]:
            self.files[name] = {'name': name, 'path': path, 'size': int(size), 'mtime': float(mtime)}
        for name in [name for name in self.entries if name not in self.files]:
            del self.entries[name]
            self.dirty = True
        self.pending = [name for mtime, size, name, path in found[:SCAN_MAX_FILES] if self._stale(name)]
        self.scanned = True
        return len(self.files)

    def _stale(self, name):
        entry = self.entries.get(name)
        info = self.files[name]
        return entry is None or entry['stamp'] != _stamp(info['size'], info['mtime'])

    def index(self, clock, budget_s=INDEX_BUDGET_S):
        started = clock()
        done = 0
        while self.pending and (done == 0 or clock() - started < budget_s):
            name = self.pending.pop(0)
            info = self.files.get(name)
            if info is None:
                continue
            self.entries[name] = {'stamp': _stamp(info['size'], info['mtime']), 'header': self.read(info['path'])}
            self.dirty = True
            done += 1
        return done

    def save(self):
        if not self.dirty or self.store is None:
            return False
        files = dict((name, entry) for name, entry in self.entries.items() if name in self.files)
        self.store.write({'v': LIBRARY_VERSION, 'files': files})
        self.dirty = False
        return True

    def progress(self):
        total = len(self.files)
        return total - len(self.pending), total

    def indexing(self):
        return bool(self.pending)

    def replays(self, account_id):
        """The account's own replays that are read, newest first: {name, path, size, mtime, header}."""
        if account_id is None:
            return []
        own = []
        for name, info in self.files.items():
            entry = self.entries.get(name)
            header = entry['header'] if entry is not None and not self._stale(name) else None
            if header and header.get('player_id') is not None and int(header['player_id']) == int(account_id):
                replay = dict(info)
                replay['header'] = header
                own.append(replay)
        own.sort(key=lambda replay: (replay['mtime'], replay['name']), reverse=True)
        return own

    def forget(self, name):
        self.files.pop(name, None)
        if self.entries.pop(name, None) is not None:
            self.dirty = True

    def moved(self, old_name, new_name, path):
        info = self.files.pop(old_name, None)
        entry = self.entries.pop(old_name, None)
        if info is None:
            return
        info = dict(info, name=new_name, path=path)
        self.files[new_name] = info
        if entry is not None:
            self.entries[new_name] = entry
        self.dirty = True


def find_own(replays, name):
    for replay in replays:
        if replay['name'] == name:
            return replay
    return None
