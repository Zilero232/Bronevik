from __future__ import absolute_import, division, print_function, unicode_literals

import os
import time

from ....core.client.component import FeatureComponent
from ....core.client.game import map_label, vehicle_short_name
from ....core.client.replays import replay_dir
from ....core.events import EVENT_REPLAY_UPLOADED
from ....core.log import log
from ....core.storage import JsonFile
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import (ACTION_DELETE, ACTION_FOLDER, ACTION_REFRESH, ACTION_RENAME, ERROR_EXISTS, ERROR_MISSING, INDEX_FILE, AutoNamer, HeaderCache,
                     ReplayActionError, UploadedIndex, build_page, find_own, name_values, own_replays, page_actions, rename_target)
from ..model.constants import AUTO_NAME_CHECK_S
from ..settings import SCHEMA, SWITCH

class ReplayManager(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.cache = HeaderCache()
        self.index = None
        self.namer = AutoNamer()
        self.checked_at = 0.0
        app.bus.on('account', self._on_account)
        app.bus.on(EVENT_REPLAY_UPLOADED, self._on_uploaded)
        app.bus.on('battle_event', self._on_battle_event)
        app.bus.on('tick', self._on_tick)
        if app.account_id:
            self._on_account(app.account_id)

    def _on_account(self, account_id):
        self.index = UploadedIndex(JsonFile(os.path.join(self.app.config_dir, INDEX_FILE % account_id)))

    def _on_uploaded(self, arena_unique_id, replay_id):
        if self.index is not None:
            self.index.add(arena_unique_id, replay_id)

    def _on_battle_event(self, event, now):
        if not self.enabled() or not self.settings.get('auto_rename'):
            return
        vehicle = event.get('vehicle') or {}
        result = self.app.translate('replay_manager_result_%s' % (event.get('result') or 'draw'))
        values = name_values(event, map_label(event.get('arena_type_id')), vehicle_short_name(vehicle.get('tank_id')), result)
        self.namer.queue(event, values, time.time())

    def _on_tick(self, now):
        if not self.namer.pending or now - self.checked_at < AUTO_NAME_CHECK_S or not self.enabled_in_hangar():
            return
        self.checked_at = now
        for replay, name in self.namer.plan(self._replays(), self.settings.get('name_template'), now):
            try:
                self._rename(replay, name)
            except (ReplayActionError, IOError, OSError):
                log('replay manager: auto name %s -> %s failed' % (replay['name'], name))

    def _replays(self):
        return own_replays(replay_dir(), self.app.account_id, self.cache)

    def ui_actions(self):
        return page_actions(self.app.translate) if self.enabled_in_hangar() else []

    def ui_page(self):
        if not self.enabled_in_hangar() or self.index is None:
            return None
        return build_page(self._replays(), self.index, self.app.translate, self.settings.get('max_rows'), self.settings.get('uploaded_only'))

    def ui_action(self, action, row=None, value=None):
        if not self.enabled_in_hangar():
            return None
        translate = self.app.translate
        try:
            if action == ACTION_REFRESH:
                self.cache = HeaderCache()
                return None
            if action == ACTION_FOLDER:
                return self._open_folder()
            replay = find_own(self._replays(), row)
            if replay is None:
                raise ReplayActionError(ERROR_MISSING)
            if action == ACTION_RENAME:
                return self._rename(replay, value)
            if action == ACTION_DELETE:
                return self._delete(replay)
        except ReplayActionError as error:
            return {'kind': 'error', 'text': translate('replay_manager_error_%s' % error.reason)}
        except (IOError, OSError):
            log('replay manager: %s failed' % action)
            return {'kind': 'error', 'text': translate('replay_manager_error_io')}
        return None

    def _rename(self, replay, title):
        name = rename_target(replay['name'], title)
        target = os.path.join(os.path.dirname(replay['path']), name)
        if name == replay['name']:
            return None
        if os.path.exists(target):
            raise ReplayActionError(ERROR_EXISTS)
        os.rename(replay['path'], target)
        self.cache.forget(replay['path'])
        return {'kind': 'info', 'text': self.app.translate('replay_manager_renamed', name=name)}

    def _delete(self, replay):
        os.remove(replay['path'])
        self.cache.forget(replay['path'])
        return {'kind': 'info', 'text': self.app.translate('replay_manager_deleted', name=replay['name'])}

    def _open_folder(self):
        folder = os.path.abspath(replay_dir())
        opener = getattr(os, 'startfile', None)
        if opener is None or not os.path.isdir(folder):
            raise ReplayActionError(ERROR_MISSING)
        opener(folder)
        return None
