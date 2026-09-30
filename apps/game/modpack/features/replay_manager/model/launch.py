from __future__ import absolute_import, division, print_function, unicode_literals

import os

from ....core.compat import is_number, string_types, to_text
from ....core.replay_file import is_replay_name
from .constants import LAUNCH_TTL_S


def launch_request(path, now):
    return {'path': to_text(path), 'at': float(now)}


def pending_launch(data, now, exists):
    """The replay path a fresh client start should play from the stored request, or None."""
    if not isinstance(data, dict) or not isinstance(data.get('path'), string_types) or not is_number(data.get('at')):
        return None
    path = to_text(data['path'])
    if not is_replay_name(os.path.basename(path)) or not 0 <= now - data['at'] <= LAUNCH_TTL_S:
        return None
    return path if exists(path) else None
