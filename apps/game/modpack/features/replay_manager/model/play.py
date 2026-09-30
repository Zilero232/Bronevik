from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import ERROR_BATTLE, ERROR_MISSING, ERROR_PLAYING, ERROR_UNAVAILABLE, ERROR_VERSION
from .version import compatible


def play_refusal(replay, client_version, in_battle, playing, available):
    """Why the client cannot start `replay` now (an error reason), or None when it can."""
    if not available:
        return ERROR_UNAVAILABLE
    if in_battle:
        return ERROR_BATTLE
    if playing:
        return ERROR_PLAYING
    if replay is None:
        return ERROR_MISSING
    if not compatible((replay.get('header') or {}).get('client_version'), client_version):
        return ERROR_VERSION
    return None
