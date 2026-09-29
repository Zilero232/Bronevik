from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import os
import struct
import time

from ..compat import is_int, string_types, to_text
from .constants import (AVATAR_KEY, DATE_TIME, EXTENSIONS, HEAD_FORMAT, MAGIC, MAX_BLOCKS, MAX_HEADER_BLOCK_BYTES, RECORDING_NAME, RESULT_DRAW,
                        RESULT_LOSS, RESULT_WIN, SIZE_FORMAT)


def is_replay_name(name):
    lower = to_text(name).lower()
    return lower.endswith(EXTENSIONS) and RECORDING_NAME.match(os.path.basename(lower)) is None


def _read_exact(handle, size):
    data = handle.read(size)
    return data if data is not None and len(data) == size else None


def _json_block(raw):
    try:
        return json.loads(to_text(raw, 'utf-8'))
    except (ValueError, UnicodeDecodeError):
        return None


def read_json_blocks(handle, limit=2):
    """The first `limit` JSON blocks of a replay (arena block, then the results block when the battle
    was watched to the end), or None when the file is not a replay."""
    head = _read_exact(handle, 8)
    if head is None:
        return None
    magic, count = struct.unpack(HEAD_FORMAT, head)
    if magic != MAGIC or count < 1 or count > MAX_BLOCKS:
        return None
    blocks = []
    for _ in range(min(count, limit)):
        size_raw = _read_exact(handle, 4)
        if size_raw is None:
            return None
        size = struct.unpack(SIZE_FORMAT, size_raw)[0]
        if size > MAX_HEADER_BLOCK_BYTES:
            return None
        raw = _read_exact(handle, size)
        if raw is None:
            return None
        blocks.append(_json_block(raw))
    return blocks


def parse_date_time(value):
    """The arena block's local "dd.mm.YYYY HH:MM:SS" as epoch seconds (local clock), or None."""
    if not isinstance(value, string_types):
        return None
    match = DATE_TIME.match(to_text(value))
    if match is None:
        return None
    day, month, year, hour, minute, second = [int(part) for part in match.groups()]
    try:
        return float(time.mktime((year, month, day, hour, minute, second, 0, 0, -1)))
    except (OverflowError, ValueError):
        return None


def _text_or_none(value):
    return to_text(value) if isinstance(value, string_types) and value else None


def _own_vehicle(personal):
    for key, value in personal.items():
        if key != AVATAR_KEY and isinstance(value, dict) and 'damageDealt' in value:
            return value
    return None


def own_outcome(results):
    """(result, damage) of the recorder from the results block: its own `personal` entry and the winner team only
    (fair play: the vehicles and players blocks are never read); (None, None) when unknown."""
    personal = results.get('personal') if isinstance(results.get('personal'), dict) else {}
    own = _own_vehicle(personal)
    common = results.get('common') if isinstance(results.get('common'), dict) else {}
    if own is None:
        return None, None
    damage = own.get('damageDealt') if is_int(own.get('damageDealt')) else None
    team, winner = own.get('team'), common.get('winnerTeam')
    if not is_int(team) or not is_int(winner):
        return None, damage
    return (RESULT_DRAW if winner == 0 else RESULT_WIN if winner == team else RESULT_LOSS), damage


def read_header_from(handle):
    """{player_id, arena_unique_id, date_time, map_name, map_title, vehicle, result, damage} from the header blocks, or None."""
    blocks = read_json_blocks(handle)
    if not blocks:
        return None
    arena = blocks[0] if isinstance(blocks[0], dict) else None
    if arena is None:
        return None
    header = {
        'player_id': arena.get('playerID') if is_int(arena.get('playerID')) else None,
        'date_time': parse_date_time(arena.get('dateTime')),
        'arena_unique_id': None,
        'map_name': _text_or_none(arena.get('mapName')),
        'map_title': _text_or_none(arena.get('mapDisplayName')),
        'vehicle': _text_or_none(arena.get('playerVehicle')),
        'result': None,
        'damage': None,
    }
    results = blocks[1] if len(blocks) > 1 else None
    first = results[0] if isinstance(results, list) and results else None
    if isinstance(first, dict) and first.get('arenaUniqueID') is not None:
        header['arena_unique_id'] = to_text(first.get('arenaUniqueID'))
        header['result'], header['damage'] = own_outcome(first)
    return header


def read_header(path):
    try:
        with io.open(path, 'rb') as handle:
            return read_header_from(handle)
    except (IOError, OSError, struct.error):
        return None
