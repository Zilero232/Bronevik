from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.game import client_attr
from ....core.client.native import read_settings
from ....core.client.replays import DEFAULT_REPLAY_DIR, replay_dir
from ....core.events import EVENT_REPLAY_UPLOAD_REQUEST, EVENT_REPLAY_UPLOADED
from ....core.log import log, safe
from ....core.net.transport import BackgroundRunner, SyncTransport
from ....core.storage import account_file
from ..model import ReplayQueue, ReplayUploader, battle_started_at, find_replay
from ..model.constants import (REQUEST_INVALID, REQUEST_OFF, REQUEST_READY, REQUEST_UNBOUND, UPLOAD_PATH, VISIBILITY_PRIVATE,
                               VISIBILITY_PUBLIC)
from ..settings import PUBLISH, SWITCH
from .constants import QUEUE_FILE, REPLAY_SETTING, STARTED_KEEP, UPLOAD_TIMEOUT_S


def game_records_replays():
    value = (read_settings((REPLAY_SETTING,)) or {}).get(REPLAY_SETTING)
    if value is None:
        return None
    try:
        return int(value) != 0
    except (TypeError, ValueError):
        return None


def server_to_local(server_time):
    convert = client_attr('helpers.time_utils', 'makeLocalServerTime')
    return convert(server_time) if convert is not None else server_time


# Never turns replay recording on: it uploads files the client already wrote, for battles of the bound
# account, in the hangar, while the opt-in `upload_replays` switch is on.
class ReplayAutoUpload(object):

    def __init__(self, app):
        self.app = app
        self.config_dir = app.config_dir
        self.runner = BackgroundRunner('otmetki-replays')
        self.transport = SyncTransport(timeout=UPLOAD_TIMEOUT_S)
        self.queue = None
        self.uploader = None
        self.started = {}
        self.folder = DEFAULT_REPLAY_DIR
        self.in_battle = False
        bus = app.bus
        bus.on('account', self.on_account)
        bus.on('rebind', self.on_rebind)
        bus.on('battle_start', self.on_battle_start)
        bus.on('battle_enter', self.on_battle_enter)
        bus.on('hangar', self.on_hangar)
        bus.on('battle_results', self.on_battle_result)
        bus.on('tick', self.tick)
        bus.on(EVENT_REPLAY_UPLOAD_REQUEST, self.on_request)
        if app.account_id:
            self.on_account(app.account_id)

    def _enabled(self):
        return self.app.config.is_enabled(SWITCH) and self.app.is_bound() and not self.app.auth_failed

    def on_account(self, account_id):
        self.queue = ReplayQueue(account_file(self.config_dir, QUEUE_FILE, account_id))
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
            on_replay_id=self._on_replay_id,
        )
        if self.in_battle:
            self.uploader.pause()

    def on_rebind(self):
        if self.queue is not None:
            self.queue.unblock()

    # Nothing of the upload runs in battle: its bandwidth and the worker's share of the interpreter would cost
    # ping and frames. A running upload stops at its next block and is sent again from the hangar.
    def on_battle_enter(self):
        self.in_battle = True
        if self.uploader is not None:
            self.uploader.pause()

    def on_hangar(self):
        self.in_battle = False
        if self.uploader is not None:
            self.uploader.resume()

    def on_battle_start(self, arena_unique_id):
        if arena_unique_id:
            self.started[arena_unique_id] = time.time()
            for stale in sorted(self.started, key=self.started.get)[:-STARTED_KEEP]:
                del self.started[stale]

    def on_battle_result(self, arena_unique_id, results):
        started_at = self.started.pop(arena_unique_id, None)
        if self.queue is None or not self._enabled():
            return
        if game_records_replays() is False:
            return
        started_at = battle_started_at(started_at, results, server_to_local)
        if self.queue.add(arena_unique_id, self.app.account_id, started_at, time.time()):
            log('replay queued for upload: %s' % arena_unique_id)

    # The replay manager's 'upload' (core.events.EVENT_REPLAY_UPLOAD_REQUEST): the same opt-in switch and binding as the
    # automatic upload; `request` None only asks whether an upload would be accepted.
    def on_request(self, request, reply):
        if not self.app.config.is_enabled(SWITCH):
            reply(REQUEST_OFF)
        elif not self.app.is_bound() or self.app.auth_failed or self.queue is None:
            reply(REQUEST_UNBOUND)
        elif request is None:
            reply(REQUEST_READY)
        elif request.get('account_id') != self.app.account_id:
            reply(REQUEST_INVALID)
        else:
            reply(self.queue.request(request.get('arena_unique_id'), request.get('account_id'), request.get('started_at'), time.time()))

    def _find(self, item):
        # Runs on the worker thread: plain file access in the folder the main thread resolved.
        return find_replay(self.folder, item['account_id'], item['arena_unique_id'], item.get('started_at'))

    @safe
    def _on_uploaded(self, arena_unique_id):
        log('replay uploaded: %s' % arena_unique_id)

    @safe
    def _on_replay_id(self, arena_unique_id, replay_id):
        self.app.bus.emit(EVENT_REPLAY_UPLOADED, arena_unique_id, replay_id)

    def tick(self, now):
        self.runner.poll()
        if self.uploader is None or not self._enabled():
            return
        self.uploader.credentials = self.app.current_credentials()
        self.uploader.url = self.app.config.endpoint(UPLOAD_PATH)
        self.uploader.visibility = VISIBILITY_PUBLIC if self.app.config.is_enabled(PUBLISH) else VISIBILITY_PRIVATE
        self.folder = replay_dir()
        self.uploader.tick(now)
