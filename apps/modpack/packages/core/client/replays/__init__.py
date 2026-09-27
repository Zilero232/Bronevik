"""Where the client records replays: BattleReplay's private replay dir, else ./replays (UNVERIFIED on
Lesta 1.45). Shared by the replay upload and the replay manager."""
from __future__ import absolute_import, division, print_function, unicode_literals

DEFAULT_REPLAY_DIR = 'replays'


def replay_controller():
    try:
        import BattleReplay
        return getattr(BattleReplay, 'g_replayCtrl', None)
    except Exception:
        return None


def replay_dir():
    ctrl = replay_controller()
    folder = getattr(ctrl, '_BattleReplay__replayDir', None) if ctrl is not None else None
    return folder or DEFAULT_REPLAY_DIR
