from __future__ import absolute_import, division, print_function, unicode_literals

import os
import time

from ....core.client.component import FeatureComponent
from ....core.client.game import map_label, vehicle_short_name
from ....core.client.hud.icons import client_file_exists
from ....core.client.me import can_read, post_signed, signed_body
from ....core.client.replays import replay_dir
from ....core.errors import ReasonError
from ....core.events import EVENT_COMPONENT_SETTINGS, EVENT_REPLAY_UPLOAD_REQUEST, EVENT_REPLAY_UPLOADED
from ....core.hud.icons import image
from ....core.log import log
from ....core.me import OK_STATUS
from ....core.storage import JsonFile
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import (ACTION_DELETE, ACTION_FAVOURITE, ACTION_FOLDER, ACTION_PLAY, ACTION_REFRESH, ACTION_RENAME, ACTION_UPLOAD, ERROR_EXISTS,
                     ERROR_MISSING, ERROR_NO_ARENA, INDEX_FILE, LIBRARY_FILE, AnalysisWatch, AutoNamer, PageContext, ReplayActionError,
                     ReplayLibrary, UploadedIndex, analysis_notice, build_page, find_own, name_values, page_status, parse_statuses,
                     play_refusal, rename_target)
from ..model.constants import (ANALYSIS_PATH, ANALYSIS_POLL_S, AUTO_NAME_CHECK_S, AUTO_NAME_INDEX_S, INDEX_WANTED_S, NOT_SERVED_STATUS,
                               SCAN_EVERY_S, UPLOAD_MISSING, UPLOAD_READY)
from ..settings import SCHEMA, SWITCH
from .playback import can_play, product_version, replay_busy, request_play
from .vehicles import VehicleNames

FAVOURITE_ON = '1'


def _client_image(path):
    return image(path) if path and client_file_exists(path) else None


class ReplayManager(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.library = ReplayLibrary(JsonFile(os.path.join(app.config_dir, LIBRARY_FILE)))
        self.index = None
        self.namer = AutoNamer()
        self.checked_at = 0.0
        self.analysis = AnalysisWatch()
        self.polled_at = 0.0
        self.polling = False
        self.served = True
        self.queued = set()
        self.scanned_at = 0.0
        self.wanted_at = 0.0
        self.vehicles = VehicleNames()
        app.bus.on(EVENT_REPLAY_UPLOADED, self._on_uploaded)
        app.bus.on('battle_event', self._on_battle_event)
        app.bus.on('tick', self._on_tick)
        self.follow_account(self._on_account)

    def _on_account(self, account_id):
        self.index = UploadedIndex(self.account_file(INDEX_FILE, account_id))
        self.analysis = AnalysisWatch()
        self.queued = set()

    def _on_uploaded(self, arena_unique_id, replay_id):
        self.queued.discard(arena_unique_id)
        if self.index is not None:
            self.index.add(arena_unique_id, replay_id)
        self.analysis.add(replay_id, time.time())

    def _on_battle_event(self, event, now):
        if not self.enabled() or not self.settings.get('auto_rename'):
            return
        vehicle = event.get('vehicle') or {}
        result = self.app.translate('replay_manager_result_%s' % (event.get('result') or 'draw'))
        values = name_values(event, map_label(event.get('arena_type_id')), vehicle_short_name(vehicle.get('tank_id')), result)
        self.namer.queue(event, values, time.time())

    def _on_tick(self, now):
        self._poll_analysis(now)
        self._index(now)
        if not self.namer.pending or now - self.checked_at < AUTO_NAME_CHECK_S or not self.enabled_in_hangar():
            return
        self.checked_at = now
        self._scan(now, force=True)
        self.library.index(time.time, AUTO_NAME_INDEX_S)
        for replay, name in self.namer.plan(self._replays(), self.settings.get('name_template'), now):
            try:
                self._rename(replay, name)
            except (ReplayActionError, IOError, OSError):
                log('replay manager: auto name %s -> %s failed' % (replay['name'], name))

    def _index(self, now):
        if self.library.indexing() and now - self.wanted_at <= INDEX_WANTED_S and self.enabled_in_hangar():
            self.library.index(time.time)
            self.app.bus.emit(EVENT_COMPONENT_SETTINGS, FEATURE_ID, [])
        if not self.library.indexing():
            self.library.save()

    def _scan(self, now, force=False):
        if force or now - self.scanned_at >= SCAN_EVERY_S:
            self.scanned_at = now
            self.library.scan(replay_dir())

    def _poll_analysis(self, now):
        if not self.served or self.polling or now - self.polled_at < ANALYSIS_POLL_S or not self.enabled_in_hangar():
            return
        if not self.settings.get('notify_analysis') or not can_read(self.app):
            return
        replay_ids = self.analysis.due(now)
        if not replay_ids:
            return
        try:
            payload = signed_body(self.app, replay_ids=replay_ids)
        except ReasonError as error:
            log('replay analysis not requested: %s' % error.reason)
            return
        self.polled_at = now
        self.polling = True
        account_id = self.app.account_id

        def done(status, data, retry_after):
            self.polling = False
            if status == NOT_SERVED_STATUS:
                self.served = False
            if status != OK_STATUS or account_id != self.app.account_id:
                return
            for replay_id, highlights in self.analysis.apply(parse_statuses(data, account_id)):
                self.app.ui.notify(analysis_notice(highlights, self.app.translate))

        post_signed(self.app, ANALYSIS_PATH, payload, done)

    def _replays(self):
        return self.library.replays(self.app.account_id)

    def _upload_state(self, request=None):
        answer = []
        self.app.bus.emit(EVENT_REPLAY_UPLOAD_REQUEST, request, answer.append)
        return answer[0] if answer else UPLOAD_MISSING

    def ui_actions(self):
        return []

    def ui_page(self):
        if not self.enabled_in_hangar():
            return None
        now = time.time()
        self.wanted_at = now
        self._scan(now)
        if self.library.indexing() and not self.library.entries:
            self.library.index(time.time)
        context = PageContext(self.index, product_version(), self.queued, self.analysis.parsed, self._upload_state(), self.vehicles, _client_image)
        account_id = self.app.account_id
        return build_page(self._replays(), context, page_status(account_id, self.library), self.library.progress(), os.path.abspath(replay_dir()))

    def ui_action(self, action, row=None, value=None):
        if not self.enabled_in_hangar():
            return None
        try:
            if action == ACTION_REFRESH:
                self.scanned_at = 0.0
                return None
            if action == ACTION_FOLDER:
                return self._open_folder()
            self._scan(time.time(), force=True)
            replay = find_own(self._replays(), row)
            if action == ACTION_PLAY:
                return self._play(replay)
            if replay is None:
                raise ReplayActionError(ERROR_MISSING)
            if action == ACTION_RENAME:
                return self._rename(replay, value)
            if action == ACTION_DELETE:
                return self._delete(replay)
            if action == ACTION_FAVOURITE:
                return self._favourite(replay, value == FAVOURITE_ON)
            if action == ACTION_UPLOAD:
                return self._upload(replay)
        except ReplayActionError as error:
            return self.notice_error('replay_manager_error_%s' % error.reason)
        except (IOError, OSError):
            log('replay manager: %s failed' % action)
            return self.notice_error('replay_manager_error_io')
        return None

    def _key(self, replay):
        return (replay['header'] or {}).get('arena_unique_id') or replay['name']

    def _rename(self, replay, title):
        name = rename_target(replay['name'], title)
        target = os.path.join(os.path.dirname(replay['path']), name)
        if name == replay['name']:
            return None
        if os.path.exists(target):
            raise ReplayActionError(ERROR_EXISTS)
        os.rename(replay['path'], target)
        self.library.moved(replay['name'], name, target)
        if self.index is not None:
            self.index.moved(replay['name'], name)
        return self.notice_info('replay_manager_renamed', name=name)

    def _delete(self, replay):
        os.remove(replay['path'])
        self.library.forget(replay['name'])
        if self.index is not None:
            self.index.set_favourite(self._key(replay), False)
        return self.notice_info('replay_manager_deleted', name=replay['name'])

    def _favourite(self, replay, on):
        if self.index is not None:
            self.index.set_favourite(self._key(replay), on)
        return None

    def _play(self, replay):
        refusal = play_refusal(replay, product_version(), self.app.in_battle, replay_busy(), can_play())
        if refusal is not None:
            raise ReplayActionError(refusal)
        request_play(replay['path'])
        return self.notice_info('replay_manager_play_restarting', name=replay['name'])

    def _upload(self, replay):
        header = replay['header'] or {}
        arena = header.get('arena_unique_id')
        if not arena:
            raise ReplayActionError(ERROR_NO_ARENA)
        request = {'arena_unique_id': arena, 'account_id': self.app.account_id, 'started_at': header.get('date_time')}
        state = self._upload_state(request)
        if state == UPLOAD_READY:
            self.queued.add(arena)
        return (self.notice_info if state == UPLOAD_READY else self.notice_error)('replay_manager_upload_%s' % state)

    def _open_folder(self):
        folder = os.path.abspath(replay_dir())
        opener = getattr(os, 'startfile', None)
        if opener is None or not os.path.isdir(folder):
            raise ReplayActionError(ERROR_MISSING)
        opener(folder)
        return None
