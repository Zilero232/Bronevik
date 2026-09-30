"""Where the client records replays, shared by the replay upload and the replay manager."""
from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import DEFAULT_REPLAY_DIR

__all__ = ('DEFAULT_REPLAY_DIR', 'replay_dir')


def replay_dir():
    return DEFAULT_REPLAY_DIR
