from __future__ import absolute_import, division, print_function, unicode_literals

import os

from ....core.backup import backup_dir, mirror_all, mirror_file, restore_missing
from ....core.client.component import FeatureComponent
from ....core.client.game import preferences_path
from ....core.log import log, safe
from ....core.storage import FILE_SAVED
from ..i18n import STRINGS
from ..model import ACTION_BACKUP, ACTIONS, is_config_file, restored_notice
from ..settings import SCHEMA, SECTION, SWITCH


class ConfigBackup(FeatureComponent):

    def __init__(self, app, target_dir=None):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.target_dir = target_dir or backup_dir(preferences_path())
        self.pending_notice = None
        FILE_SAVED.connect(self._on_saved, weak=False)
        app.bus.on('hangar', self._on_hangar)
        if self.target_dir is None:
            log('config backup: the client preferences folder is unknown, no backup')
        elif self.enabled():
            self.pending_notice = restored_notice(self._restore())
            self._mirror()

    def available(self):
        return self.enabled() and self.target_dir is not None

    def ui_actions(self):
        if not self.available():
            return []
        translate = self.app.translate
        return [{'id': action, 'label': translate(action), 'confirm': None} for action in ACTIONS]

    def ui_action(self, action, row=None, value=None):
        if action not in ACTIONS or not self.enabled():
            return None
        if self.target_dir is None:
            return self.notice_error('config_backup_unavailable')
        if action == ACTION_BACKUP:
            copied = self._mirror()
            if copied:
                return self.notice_info('config_backup_saved', count=len(copied))
            return self.notice_info('config_backup_up_to_date')
        notice = restored_notice(self._restore())
        if notice is None:
            return self.notice_info('config_backup_nothing_missing')
        key, params = notice
        return self.notice_info(key, **params)

    def _restore(self):
        restored = restore_missing(self.app.config_dir, self.target_dir)
        if restored:
            log('config backup: restored %s' % ', '.join(restored))
        return restored

    def _mirror(self):
        copied = mirror_all(self.app.config_dir, self.target_dir)
        if copied:
            log('config backup: copied %s' % ', '.join(copied))
        return copied

    # The files come back before the lobby exists; the player hears of it in the first hangar.
    @safe
    def _on_hangar(self):
        notice, self.pending_notice = self.pending_notice, None
        if notice is not None:
            key, params = notice
            self.app.ui.notify(self.app.translate(key, **params))
        if self.available():
            self._mirror()

    @safe
    def _on_saved(self, path):
        if self.available() and is_config_file(path, self.app.config_dir):
            mirror_file(self.app.config_dir, self.target_dir, os.path.basename(path))
