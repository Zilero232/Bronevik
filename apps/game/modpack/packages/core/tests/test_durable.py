# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import os
import shutil
import stat
import sys
import tempfile
import unittest

import _support  # noqa: F401
from otmetki.companion.binding import Credentials, CredentialStore
from otmetki.core.durable import MirroredFile, open_config
from otmetki.core.durable.constants import STAMPS_NAME
from otmetki.core.durable.paths import durable_dir, to_path_text
from otmetki.core.hud import ComponentConfig
from otmetki.core.settings import Schema
from otmetki.core.storage import JsonFile

SECRET = 's' * 40


class Clock(object):

    def __init__(self, now=1000.0):
        self.now = now

    def __call__(self):
        self.now += 10.0
        return self.now


def _read(path):
    with io.open(path, 'r', encoding='utf-8') as handle:
        return json.load(handle)


def _write_raw(path, data, mtime):
    directory = os.path.dirname(path)
    if not os.path.isdir(directory):
        os.makedirs(directory)
    with io.open(path, 'w', encoding='utf-8') as handle:
        handle.write(json.dumps(data, ensure_ascii=False))
    os.utime(path, (mtime, mtime))


def _stamp(directory, name):
    return _read(os.path.join(directory, STAMPS_NAME))['files'][name]


class DurableTestCase(unittest.TestCase):

    def setUp(self):
        self.root = tempfile.mkdtemp()
        self.game = os.path.join(self.root, 'mods', 'configs', 'otmetki')
        self.appdata = os.path.join(self.root, 'AppData', 'TriOtmetki')
        self.clock = Clock()

    def tearDown(self):
        shutil.rmtree(self.root, ignore_errors=True)

    def open(self, name='config.json'):
        return MirroredFile(self.game, self.appdata, name, pretty=True, clock=self.clock)


class MirroredFileTest(DurableTestCase):

    def test_write_goes_to_both_copies_with_one_stamp(self):
        self.open().write({'enabled': True})
        self.assertEqual(_read(os.path.join(self.game, 'config.json')), {'enabled': True})
        self.assertEqual(_read(os.path.join(self.appdata, 'config.json')), {'enabled': True})
        self.assertEqual(_stamp(self.game, 'config.json'), 1010.0)
        self.assertEqual(_stamp(self.appdata, 'config.json'), 1010.0)

    def test_wiped_game_folder_is_restored_on_load(self):
        self.open().write({'language': 'en'})
        self.open('profiles.json').write({'version': 1, 'profiles': []})
        shutil.rmtree(os.path.join(self.root, 'mods'))
        self.assertEqual(self.open().read({}), {'language': 'en'})
        self.assertEqual(_read(os.path.join(self.game, 'config.json')), {'language': 'en'})
        self.assertEqual(self.open('profiles.json').read(), {'version': 1, 'profiles': []})
        self.assertEqual(_stamp(self.game, 'config.json'), 1010.0)

    def test_missing_durable_copy_is_created_on_load(self):
        _write_raw(os.path.join(self.game, 'config.json'), {'enabled': False}, 500.0)
        self.assertEqual(self.open().read(), {'enabled': False})
        self.assertEqual(_read(os.path.join(self.appdata, 'config.json')), {'enabled': False})
        self.assertEqual(_stamp(self.appdata, 'config.json'), 500.0)

    def test_older_game_copy_loses_to_newer_durable_copy(self):
        self.open().write({'value': 'old'})
        _write_raw(os.path.join(self.appdata, 'config.json'), {'value': 'new'}, 5000.0)
        self.assertEqual(self.open().read(), {'value': 'new'})
        self.assertEqual(_read(os.path.join(self.game, 'config.json')), {'value': 'new'})

    def test_newer_game_copy_wins_over_older_durable_copy(self):
        self.open().write({'value': 'old'})
        _write_raw(os.path.join(self.game, 'config.json'), {'value': 'hand edited'}, 9000.0)
        self.assertEqual(self.open().read(), {'value': 'hand edited'})
        self.assertEqual(_read(os.path.join(self.appdata, 'config.json')), {'value': 'hand edited'})
        self.assertEqual(_stamp(self.appdata, 'config.json'), 9000.0)

    def test_equal_stamps_keep_the_game_copy(self):
        _write_raw(os.path.join(self.game, 'config.json'), {'side': 'game'}, 700.0)
        _write_raw(os.path.join(self.appdata, 'config.json'), {'side': 'durable'}, 700.0)
        self.assertEqual(self.open().read(), {'side': 'game'})
        self.assertEqual(_read(os.path.join(self.appdata, 'config.json')), {'side': 'durable'})

    def test_recorded_stamps_outweigh_older_mtimes(self):
        self.open().write({'value': 'stamped'})
        _write_raw(os.path.join(self.game, 'config.json'), {'value': 'copied back'}, 100.0)
        durable = os.path.join(self.appdata, 'config.json')
        _write_raw(durable, {'value': 'stamped'}, 100.0)
        self.assertEqual(self.open().read(), {'value': 'copied back'})
        self.assertEqual(_read(durable), {'value': 'stamped'})

    def test_unreadable_game_copy_is_restored(self):
        self.open().write({'value': 1})
        with io.open(os.path.join(self.game, 'config.json'), 'w', encoding='utf-8') as handle:
            handle.write('{broken')
        self.assertEqual(self.open().read(), {'value': 1})

    def test_nothing_anywhere_gives_the_default(self):
        self.assertEqual(self.open().read('fallback'), 'fallback')
        self.assertFalse(os.path.exists(self.appdata))

    def test_failing_durable_side_never_fails_the_save(self):
        os.makedirs(os.path.dirname(self.appdata))
        with io.open(self.appdata, 'w', encoding='utf-8') as handle:
            handle.write('not a folder')
        storage = self.open()
        storage.write({'enabled': True})
        self.assertEqual(_read(os.path.join(self.game, 'config.json')), {'enabled': True})
        self.assertIsNotNone(storage.mirror_error)
        self.assertEqual(storage.read(), {'enabled': True})

    def test_delete_removes_both_copies(self):
        storage = self.open()
        storage.write({'enabled': True})
        storage.delete()
        self.assertEqual(self.open().read('gone'), 'gone')

    @unittest.skipIf(sys.platform == 'win32', 'Windows has no owner-only mode bits; the per-user %APPDATA% ACL applies')
    def test_credentials_are_owner_only(self):
        self.open('credentials.json').write({'accounts': {}})
        for directory in (self.game, self.appdata):
            mode = stat.S_IMODE(os.stat(os.path.join(directory, 'credentials.json')).st_mode)
            self.assertEqual(mode, 0o600)

    def test_cyrillic_folders(self):
        self.game = os.path.join(self.root, 'Игры', 'Мир танков', 'mods', 'configs', 'otmetki')
        self.appdata = os.path.join(self.root, 'Пользователь', 'AppData', 'Roaming', 'TriOtmetki')
        self.open().write({'name': 'Три отметки'})
        shutil.rmtree(os.path.join(self.root, 'Игры'))
        self.assertEqual(self.open().read(), {'name': 'Три отметки'})


class WipeAndRestoreTest(DurableTestCase):

    def test_binding_and_layout_survive_a_wiped_configs_folder(self):
        store = CredentialStore(open_config(self.game, 'credentials.json', mirror_dir=self.appdata, clock=self.clock))
        store.save(Credentials('device-1', SECRET, 42, 1700000000))
        schema = Schema({'x': 10, 'visible': True})
        ComponentConfig(open_config(self.game, 'components.json', pretty=True, mirror_dir=self.appdata)).section('damage_log', schema)
        config = ComponentConfig(open_config(self.game, 'components.json', pretty=True, mirror_dir=self.appdata))
        config.section('damage_log', schema)
        config.update('damage_log', {'x': 250})

        shutil.rmtree(os.path.join(self.root, 'mods'))

        restored = CredentialStore(open_config(self.game, 'credentials.json', mirror_dir=self.appdata))
        self.assertEqual(restored.get(42).device_id, 'device-1')
        layout = ComponentConfig(open_config(self.game, 'components.json', pretty=True, mirror_dir=self.appdata))
        self.assertEqual(layout.section('damage_log', schema).get('x'), 250)
        self.assertTrue(os.path.exists(os.path.join(self.game, 'credentials.json')))


class OpenConfigTest(DurableTestCase):

    def test_other_files_stay_plain(self):
        self.assertIsInstance(open_config(self.game, 'outbox_42.json', mirror_dir=self.appdata), JsonFile)

    def test_no_durable_folder_means_plain_file(self):
        self.assertIsInstance(open_config(self.game, 'config.json', mirror_dir=None), JsonFile)

    def test_durable_files_are_mirrored(self):
        for name in ('credentials.json', 'config.json', 'components.json', 'profiles.json', 'state.json'):
            self.assertIsInstance(open_config(self.game, name, mirror_dir=self.appdata), MirroredFile)

    def test_default_folder_comes_from_appdata(self):
        storage = open_config(self.game, 'config.json')
        self.assertEqual(os.path.dirname(storage.mirror.path), durable_dir())


class DurableDirTest(unittest.TestCase):

    def test_appdata(self):
        self.assertEqual(durable_dir({'APPDATA': os.path.join('C:', 'Users', 'Игрок', 'AppData', 'Roaming')}, 'win32'),
                         os.path.join('C:', 'Users', 'Игрок', 'AppData', 'Roaming', 'TriOtmetki'))

    def test_appdata_as_bytes_in_the_file_system_encoding(self):
        folder = os.path.join('C:', 'Users', 'Игрок')
        try:
            encoded = folder.encode(sys.getfilesystemencoding() or 'utf-8')
        except LookupError:
            encoded = folder.encode('utf-8')
        self.assertEqual(durable_dir({'APPDATA': encoded}, 'win32'), os.path.join(folder, 'TriOtmetki'))

    def test_windows_fallback_to_the_home_folder(self):
        home = os.path.join('C:', 'Users', 'Игрок')
        self.assertEqual(durable_dir({}, 'win32', lambda path: home), os.path.join(home, 'AppData', 'Roaming', 'TriOtmetki'))

    def test_posix_fallback(self):
        self.assertEqual(durable_dir({}, 'linux2', lambda path: '/home/player'), os.path.join('/home/player', '.config', 'TriOtmetki'))

    def test_unknown_home(self):
        self.assertIsNone(durable_dir({}, 'win32', lambda path: path))

    def test_path_text(self):
        self.assertIsNone(to_path_text(None))
        self.assertEqual(to_path_text('путь'), 'путь')
        self.assertEqual(to_path_text('путь'.encode('utf-8')), 'путь')


if __name__ == '__main__':
    unittest.main()
