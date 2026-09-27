from __future__ import absolute_import

import os
import time

from ...core.log import log, safe
from ...core.signing import clock_offset
from ...core.storage import JsonFile
from ...core.transport import BackgroundRunner, SyncTransport
from .files import UPLOAD_PATH, VISIBILITY_PRIVATE, VISIBILITY_PUBLIC, find_replay
from .model import ReplayQueue, ReplayUploader

UPLOAD_TIMEOUT_S = 120.0
DEFAULT_REPLAY_DIR = 'replays'
STARTED_KEEP = 20
# account_helpers.settings_core.settings_constants.GAME.REPLAY_ENABLED: 0 off, 1 last battle, 2 all.
# UNVERIFIED on Lesta 1.45; an unknown name reads as None and the mod then just looks for a file.
REPLAY_SETTING = 'replayEnabled'


def _replay_ctrl():
    try:
        import BattleReplay
        return getattr(BattleReplay, 'g_replayCtrl', None)
    except Exception:
        return None


def replay_dir():
    """The folder the client records replays into (BattleReplay's private __replayDir, else ./replays)."""
    ctrl = _replay_ctrl()
    folder = getattr(ctrl, '_BattleReplay__replayDir', None) if ctrl is not None else None
    return folder or DEFAULT_REPLAY_DIR


def game_records_replays():
    """False only when the game's own replay setting is known to be off; None when it can't be read."""
    try:
        from helpers import dependency
        from skeletons.account_helpers.settings_core import ISettingsCore
        value = dependency.instance(ISettingsCore).getSetting(REPLAY_SETTING)
    except Exception:
        return None
    if value is None:
        return None
    try:
        return int(value) != 0
    except (TypeError, ValueError):
        return None


class ReplayAutoUpload(object):
    """Glue for the opt-in `upload_replays` switch. It never turns replay recording on: it only
    uploads files the client already wrote, for battles of the bound account, in the hangar."""

    def __init__(self, app):
        self.app = app
        self.config_dir = app.config_dir
        self.runner = BackgroundRunner('otmetki-replays')
        self.transport = SyncTransport(timeout=UPLOAD_TIMEOUT_S)
        self.queue = None
        self.uploader = None
        self.started = {}
        self.folder = DEFAULT_REPLAY_DIR
        bus = app.bus
        bus.on('account', self.on_account)
        bus.on('rebind', self.on_rebind)
        bus.on('battle_start', self.on_battle_start)
        bus.on('battle_results', self.on_battle_result)
        bus.on('tick', self.tick)
        if app.account_id:
            self.on_account(app.account_id)

    def _enabled(self):
        return self.app.config.is_enabled('upload_replays') and self.app.is_bound() and not self.app.auth_failed

    def on_account(self, account_id):
        self.queue = ReplayQueue(JsonFile(os.path.join(self.config_dir, 'replays_%d.json' % account_id)))
        self.uploader = ReplayUploader(
            self.queue,
            self.app.current_credentials(),
            self.runner,
            self.transport,
            self.app.config.endpoint(UPLOAD_PATH),
            self.app.user_agent(),
            self._find,
            time.time,
            on_auth_failed=self.app.on_auth_failed,
            on_uploaded=self._on_uploaded,
        )

    def on_rebind(self):
        if self.queue is not None:
            self.queue.unblock()

    @safe
    def on_battle_start(self, arena_unique_id):
        if arena_unique_id:
            self.started[arena_unique_id] = time.time()
            for stale in sorted(self.started, key=self.started.get)[:-STARTED_KEEP]:
                del self.started[stale]

    @safe
    def on_battle_result(self, arena_unique_id, results):
        started_at = self.started.pop(arena_unique_id, None)
        if self.queue is None or not self._enabled():
            return
        if game_records_replays() is False:
            return
        if started_at is None:
            created = (results.get('common') or {}).get('arenaCreateTime')
            started_at = float(created) - clock_offset() if created else None
        if self.queue.add(arena_unique_id, self.app.account_id, started_at, time.time()):
            log('replay queued for upload: %s' % arena_unique_id)

    def _find(self, item):
        # Runs on the worker thread: only the folder resolved on the main thread, plain file access.
        return find_replay(self.folder, item['account_id'], item['arena_unique_id'], item.get('started_at'))

    @safe
    def _on_uploaded(self, arena_unique_id):
        log('replay uploaded: %s' % arena_unique_id)

    def tick(self, now):
        """Hangar only: hand finished jobs back to the main thread and start the next upload."""
        self.runner.poll()
        if self.uploader is None or not self._enabled():
            return
        self.uploader.credentials = self.app.current_credentials()
        self.uploader.url = self.app.config.endpoint(UPLOAD_PATH)
        self.uploader.visibility = VISIBILITY_PUBLIC if self.app.config.is_enabled('publish_replays') else VISIBILITY_PRIVATE
        self.folder = replay_dir()
        self.uploader.tick(now)
