from __future__ import absolute_import, division, print_function, unicode_literals

import binascii
import os

from ....core.compat import to_bytes, to_text
from ....core.replay_file import EXTENSIONS, is_replay_name, read_header
from .constants import FILE_FIELD, MATCH_WINDOW_S, MAX_CANDIDATES, UNSAFE_NAME_CHARS


def matches(header, account_id, arena_unique_id, started_at):
    if not header or header.get('player_id') is None or account_id is None:
        return False
    if int(header['player_id']) != int(account_id):
        return False
    if header.get('arena_unique_id'):
        return header['arena_unique_id'] == to_text(arena_unique_id)
    if started_at is None or header.get('date_time') is None:
        return False
    return abs(header['date_time'] - float(started_at)) <= MATCH_WINDOW_S


def find_replay(folder, account_id, arena_unique_id, started_at, listdir=None, stat=None, read=None):
    listdir = listdir or os.listdir
    stat = stat or os.stat
    read = read or read_header
    try:
        names = listdir(folder)
    except (IOError, OSError):
        return None
    candidates = []
    for name in names:
        if not is_replay_name(name):
            continue
        path = os.path.join(folder, name)
        try:
            info = stat(path)
        except (IOError, OSError):
            continue
        if started_at is not None and info.st_mtime < float(started_at) - MATCH_WINDOW_S:
            continue
        candidates.append((info.st_mtime, info.st_size, path))
    candidates.sort(reverse=True)
    for mtime, size, path in candidates[:MAX_CANDIDATES]:
        if matches(read(path), account_id, arena_unique_id, started_at):
            return path, size, mtime
    return None


def upload_name(path):
    base = os.path.basename(to_text(path))
    stem, extension = os.path.splitext(base)
    stem = UNSAFE_NAME_CHARS.sub('_', stem).strip('_') or 'replay'
    extension = extension.lower() if extension.lower() in EXTENSIONS else EXTENSIONS[-1]
    return stem[:200] + extension


def new_boundary():
    return '----otmetki' + to_text(binascii.hexlify(os.urandom(12)))


def build_multipart(file_name, data, boundary=None):
    boundary = boundary or new_boundary()
    head = (
        '--%s\r\n'
        'Content-Disposition: form-data; name="%s"; filename="%s"\r\n'
        'Content-Type: application/octet-stream\r\n'
        '\r\n'
    ) % (boundary, FILE_FIELD, upload_name(file_name))
    tail = '\r\n--%s--\r\n' % boundary
    return 'multipart/form-data; boundary=' + boundary, to_bytes(head) + to_bytes(data) + to_bytes(tail)
