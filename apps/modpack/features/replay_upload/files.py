"""Finding the player's own replay file of a battle and packing it for POST /replays/mod.

Pure logic: the replays folder, clock and file access are injected by the caller.
Constants mirror contract/replay-upload.schema.json (#/definitions/limits).
"""
import binascii
import io
import json
import os
import re
import struct
import time

from ...core.compat import is_int, string_types, to_bytes, to_text

UPLOAD_PATH = '/replays/mod'
FILE_FIELD = 'file'
MAX_BYTES = 50 * 1024 * 1024
EXTENSIONS = ('.mtreplay', '.wotreplay')
VISIBILITY_HEADER = 'X-Otmetki-Visibility'
VISIBILITY_PUBLIC = 'public'
VISIBILITY_PRIVATE = 'private'

MAGIC = 0x11343212
MAX_BLOCKS = 16
MAX_HEADER_BLOCK_BYTES = 16 * 1024 * 1024
RECORDING_NAMES = ('temp.wotreplay', 'temp.mtreplay')
MATCH_WINDOW_S = 300.0
MAX_CANDIDATES = 30
SETTLE_S = 5.0

_DATE_TIME = re.compile(r'^\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*$')
_UNSAFE_NAME = re.compile(r'[^A-Za-z0-9._-]+')


def is_replay_name(name):
    lower = to_text(name).lower()
    return lower.endswith(EXTENSIONS) and os.path.basename(lower) not in RECORDING_NAMES


def _read_exact(handle, size):
    data = handle.read(size)
    return data if data is not None and len(data) == size else None


def _json_block(raw):
    try:
        return json.loads(to_text(raw, 'utf-8'))
    except (ValueError, UnicodeDecodeError):
        return None


def read_header_from(handle):
    """Reads the JSON blocks at the start of a replay: the arena block and, when the player saw the
    end of the battle, the results block. Returns {player_id, arena_unique_id, date_time} or None."""
    head = _read_exact(handle, 8)
    if head is None:
        return None
    magic, count = struct.unpack('<II', head)
    if magic != MAGIC or count < 1 or count > MAX_BLOCKS:
        return None
    blocks = []
    for _ in range(min(count, 2)):
        size_raw = _read_exact(handle, 4)
        if size_raw is None:
            return None
        size = struct.unpack('<I', size_raw)[0]
        if size > MAX_HEADER_BLOCK_BYTES:
            return None
        raw = _read_exact(handle, size)
        if raw is None:
            return None
        blocks.append(_json_block(raw))
    arena = blocks[0] if isinstance(blocks[0], dict) else None
    if arena is None:
        return None
    header = {
        'player_id': arena.get('playerID') if is_int(arena.get('playerID')) else None,
        'date_time': parse_date_time(arena.get('dateTime')),
        'arena_unique_id': None,
    }
    results = blocks[1] if len(blocks) > 1 else None
    first = results[0] if isinstance(results, list) and results else None
    if isinstance(first, dict) and first.get('arenaUniqueID') is not None:
        header['arena_unique_id'] = to_text(first.get('arenaUniqueID'))
    return header


def read_header(path):
    try:
        with io.open(path, 'rb') as handle:
            return read_header_from(handle)
    except (IOError, OSError, struct.error):
        return None


def parse_date_time(value):
    """The arena block's local "dd.mm.YYYY HH:MM:SS" as epoch seconds (local clock), or None."""
    if not isinstance(value, string_types):
        return None
    match = _DATE_TIME.match(to_text(value))
    if match is None:
        return None
    day, month, year, hour, minute, second = [int(part) for part in match.groups()]
    try:
        return float(time.mktime((year, month, day, hour, minute, second, 0, 0, -1)))
    except (OverflowError, ValueError):
        return None


def matches(header, account_id, arena_unique_id, started_at):
    """Own replay of this battle: the recorder is the bound account, and the results block names the
    arena; without a results block (left early) the recording start must be within the match window."""
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
    """(path, size, mtime) of the newest replay in `folder` that matches the battle, or None."""
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
    """ASCII file name for the multipart part; keeps the extension the server checks."""
    base = os.path.basename(to_text(path))
    stem, extension = os.path.splitext(base)
    stem = _UNSAFE_NAME.sub('_', stem).strip('_') or 'replay'
    extension = extension.lower() if extension.lower() in EXTENSIONS else EXTENSIONS[-1]
    return stem[:200] + extension


def new_boundary():
    return '----otmetki' + to_text(binascii.hexlify(os.urandom(12)))


def build_multipart(file_name, data, boundary=None):
    """(content_type, body) of a multipart/form-data request with one file part."""
    boundary = boundary or new_boundary()
    head = (
        '--%s\r\n'
        'Content-Disposition: form-data; name="%s"; filename="%s"\r\n'
        'Content-Type: application/octet-stream\r\n'
        '\r\n'
    ) % (boundary, FILE_FIELD, upload_name(file_name))
    tail = '\r\n--%s--\r\n' % boundary
    return 'multipart/form-data; boundary=' + boundary, to_bytes(head) + to_bytes(data) + to_bytes(tail)
