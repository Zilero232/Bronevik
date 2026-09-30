# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import importlib
import io
import os
import shutil
import sys
import tempfile
import types
import unittest

import _support
from otmetki.core.events import EventBus
from otmetki.core.hud import ComponentConfig
from otmetki.core.storage import JsonFile, MemoryFile
from otmetki.features.config_backup.i18n import STRINGS
from otmetki.features.config_backup.model import is_config_file, restored_notice
from otmetki.features.config_backup.settings import SETTINGS

CLIENT_PREFIX = 'otmetki.core.client'
FEATURE_CLIENT = 'otmetki.features.config_backup.client'


def load_client():
    saved = sys.modules.get('BigWorld')
    sys.modules['BigWorld'] = types.ModuleType(str('BigWorld'))
    try:
        hud = importlib.import_module('otmetki.core.client.hud')
        hud._state['config'] = ComponentConfig(MemoryFile())
        return importlib.import_module(FEATURE_CLIENT)
    finally:
        if saved is None:
            sys.modules.pop('BigWorld', None)
        else:
            sys.modules['BigWorld'] = saved
        for name in [name for name in sys.modules if name.startswith((CLIENT_PREFIX, FEATURE_CLIENT))]:
            del sys.modules[name]


class Ui(object):

    def __init__(self):
        self.notices = []

    def notify(self, text):
        self.notices.append(text)


class Config(object):

    def __init__(self):
        self.enabled = True

    def is_enabled(self, switch):
        return self.enabled


class App(object):

    def __init__(self, config_dir):
        self.config_dir = config_dir
        self.bus = EventBus()
        self.translate = _support.translator({'ru': {}, 'en': {}})
        self.config = Config()
        self.ui = Ui()
        self.in_battle = False


def write(directory, name, text):
    if not os.path.isdir(directory):
        os.makedirs(directory)
    with io.open(os.path.join(directory, name), 'w', encoding='utf-8') as handle:
        handle.write(text)


class ModelTest(unittest.TestCase):

    def test_the_switch_is_config_backup(self):
        assert SETTINGS == ('config_backup',)

    def test_a_saved_file_counts_only_in_the_config_folder(self):
        folder = os.path.join('mods', 'configs', 'otmetki')

        assert is_config_file(os.path.join(folder, 'config.json'), folder)
        assert not is_config_file(os.path.join('AppData', 'TriOtmetki', 'config.json'), folder)
        assert not is_config_file(None, folder)

    def test_the_restore_message_names_the_files(self):
        assert restored_notice([]) is None
        notice = restored_notice(['a.json', 'b.json'])

        assert notice == ('config_backup_restored', {'count': 2, 'files': 'a.json, b.json'})

    def test_ru_and_en_strings_match(self):
        assert set(STRINGS['ru']) == set(STRINGS['en'])


class ConfigBackupClientTest(unittest.TestCase):

    def setUp(self):
        self.root = tempfile.mkdtemp(prefix='otmetki-config-backup-')
        self.config = os.path.join(self.root, 'mods', 'configs', 'otmetki')
        self.backup = os.path.join(self.root, 'MirTankov', 'otmetki_backup')
        self.client = load_client()
        self.features = []

    def tearDown(self):
        for feature in self.features:
            self.client.FILE_SAVED.disconnect(feature._on_saved)
        shutil.rmtree(self.root, True)

    def start(self, enabled=True):
        app = App(self.config)
        app.config.enabled = enabled
        feature = self.client.ConfigBackup(app, target_dir=self.backup)
        self.features.append(feature)
        return app, feature

    def test_the_first_start_copies_the_settings(self):
        write(self.config, 'config.json', '{"a": 1}')

        self.start()

        assert os.path.isfile(os.path.join(self.backup, 'config.json'))

    def test_a_wiped_file_comes_back_and_the_player_hears_of_it_in_the_hangar(self):
        write(self.backup, 'marks_history_7.json', '[1]')

        app, _ = self.start()

        assert os.path.isfile(os.path.join(self.config, 'marks_history_7.json'))
        assert app.ui.notices == []
        app.bus.emit('hangar')
        assert len(app.ui.notices) == 1

    def test_every_save_is_mirrored(self):
        self.start()

        JsonFile(os.path.join(self.config, 'profiles.json')).write({'p': 1})

        assert os.path.isfile(os.path.join(self.backup, 'profiles.json'))

    def test_switched_off_it_neither_restores_nor_copies(self):
        write(self.backup, 'profiles.json', '{}')

        self.start(enabled=False)
        JsonFile(os.path.join(self.config, 'config.json')).write({'a': 1})

        assert not os.path.exists(os.path.join(self.config, 'profiles.json'))
        assert not os.path.exists(os.path.join(self.backup, 'config.json'))

    def test_the_window_buttons_back_up_and_restore(self):
        _, feature = self.start()
        write(self.config, 'config.json', '{"a": 2}')

        assert [action['id'] for action in feature.ui_actions()] == ['config_backup_now', 'config_backup_restore']
        assert feature.ui_action('config_backup_now')['kind'] == 'info'
        os.remove(os.path.join(self.config, 'config.json'))
        assert feature.ui_action('config_backup_restore')['kind'] == 'info'
        assert os.path.isfile(os.path.join(self.config, 'config.json'))
        assert feature.ui_action('something_else') is None

    def test_without_the_preferences_folder_there_is_no_backup(self):
        app = App(self.config)
        feature = self.client.ConfigBackup(app)
        self.features.append(feature)

        assert feature.target_dir is None
        assert feature.ui_actions() == []
        assert feature.ui_action('config_backup_now')['kind'] == 'error'


if __name__ == '__main__':
    unittest.main()
