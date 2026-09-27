"""Glue of the replay manager: the client's replay folder, file renames and deletes, the window page.
Hangar only; it reads the player's own replay files and nothing of the battle."""
from __future__ import absolute_import, division, print_function, unicode_literals

import os

from ....core.client.hud import component_config
from ....core.client.replays import replay_dir
from ....core.log import log, safe
from ....core.storage import JsonFile
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import (ACTION_DELETE, ACTION_FOLDER, ACTION_REFRESH, ACTION_RENAME, ERROR_EXISTS, ERROR_MISSING, INDEX_FILE, HeaderCache,
                     ReplayActionError, UploadedIndex, build_page, find_own, own_replays, page_actions, rename_target)
from ..settings import SCHEMA, SWITCH

REPLAY_UPLOADED_EVENT = 'replay_uploaded'


class ReplayManager(object):

    def __init__(self, app):
        self.app = app
        app.translate.catalog.add(STRINGS)
        self.settings = component_config(app).section(FEATURE_ID, SCHEMA)
        self.cache = HeaderCache()
        self.index = None
        app.bus.on('account', self._on_account)
        app.bus.on(REPLAY_UPLOADED_EVENT, self._on_uploaded)
        if app.account_id:
            self._on_account(app.account_id)

    def _on_account(self, account_id):
        self.index = UploadedIndex(JsonFile(os.path.join(self.app.config_dir, INDEX_FILE % account_id)))

    @safe
    def _on_uploaded(self, arena_unique_id, replay_id):
        if self.index is not None:
            self.index.add(arena_unique_id, replay_id)

    def _enabled(self):
        return self.app.config.is_enabled(SWITCH) and not self.app.in_battle

    def _replays(self):
        return own_replays(replay_dir(), self.app.account_id, self.cache)

    def ui_actions(self):
        return page_actions(self.app.translate) if self._enabled() else []

    def ui_page(self):
        if not self._enabled() or self.index is None:
            return None
        return build_page(self._replays(), self.index, self.app.translate, self.settings.get('max_rows'), self.settings.get('uploaded_only'))

    def ui_action(self, action, row=None, value=None):
        if not self._enabled():
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
