from __future__ import absolute_import, division, print_function, unicode_literals

import io
import os
import shutil
import tempfile
import unittest

import _support  # noqa: F401
from otmetki.core.backup import backup_dir, is_backed_up, mirror_all, mirror_file, restore_missing
from otmetki.core.storage import FILE_SAVED, JsonFile


def write(directory, name, text):
    if not os.path.isdir(directory):
        os.makedirs(directory)
    with io.open(os.path.join(directory, name), 'w', encoding='utf-8') as handle:
        handle.write(text)


def read(directory, name):
    with io.open(os.path.join(directory, name), 'r', encoding='utf-8') as handle:
        return handle.read()


class BackupDirTest(unittest.TestCase):

    def test_the_backup_sits_beside_the_preferences_file(self):
        found = backup_dir(os.path.join('Users', 'me', 'AppData', 'Roaming', 'Lesta', 'MirTankov', 'preferences.xml'))

        assert os.path.basename(found) == 'otmetki_backup'
        assert os.path.basename(os.path.dirname(found)) == 'MirTankov'

    def test_no_preferences_path_means_no_backup(self):
        assert backup_dir(None) is None
        assert backup_dir('') is None

    def test_only_settings_json_is_backed_up(self):
        assert is_backed_up('config.json')
        assert is_backed_up('marks_history_1001.json')
        assert not is_backed_up('outbox_1001.json')
        assert not is_backed_up('config.json.tmp')
        assert not is_backed_up('session.log')


class MirrorTest(unittest.TestCase):

    def setUp(self):
        self.root = tempfile.mkdtemp(prefix='otmetki-backup-')
        self.config = os.path.join(self.root, 'mods', 'configs', 'otmetki')
        self.backup = os.path.join(self.root, 'MirTankov', 'otmetki_backup')
        write(self.config, 'config.json', '{"a": 1}')
        write(self.config, 'components.json', '{}')
        write(self.config, 'outbox_7.json', '[]')

    def tearDown(self):
        shutil.rmtree(self.root, True)

    def test_mirror_all_copies_the_settings_but_not_the_send_queue(self):
        copied = mirror_all(self.config, self.backup)

        assert copied == ['components.json', 'config.json']
        assert read(self.backup, 'config.json') == '{"a": 1}'
        assert not os.path.exists(os.path.join(self.backup, 'outbox_7.json'))

    def test_an_unchanged_file_is_not_copied_again(self):
        mirror_all(self.config, self.backup)

        assert mirror_all(self.config, self.backup) == []
        assert not mirror_file(self.config, self.backup, 'config.json')

    def test_a_changed_file_is_copied(self):
        mirror_all(self.config, self.backup)
        write(self.config, 'config.json', '{"a": 22}')

        assert mirror_file(self.config, self.backup, 'config.json')
        assert read(self.backup, 'config.json') == '{"a": 22}'

    def test_a_missing_file_is_not_mirrored(self):
        assert not mirror_file(self.config, self.backup, 'profiles.json')

    def test_restore_brings_back_only_the_wiped_files(self):
        mirror_all(self.config, self.backup)
        write(self.config, 'config.json', '{"a": 3}')
        os.remove(os.path.join(self.config, 'components.json'))

        restored = restore_missing(self.config, self.backup)

        assert restored == ['components.json']
        assert read(self.config, 'components.json') == '{}'
        assert read(self.config, 'config.json') == '{"a": 3}'

    def test_restore_rebuilds_a_wiped_config_folder(self):
        mirror_all(self.config, self.backup)
        shutil.rmtree(os.path.join(self.root, 'mods'))

        assert restore_missing(self.config, self.backup) == ['components.json', 'config.json']
        assert read(self.config, 'config.json') == '{"a": 1}'

    def test_restore_without_a_backup_does_nothing(self):
        assert restore_missing(self.config, os.path.join(self.root, 'nowhere')) == []


class FileSavedTest(unittest.TestCase):

    def test_every_json_write_announces_its_path(self):
        root = tempfile.mkdtemp(prefix='otmetki-saved-')
        saved = []

        def on_saved(path):
            saved.append(path)

        FILE_SAVED.connect(on_saved)
        try:
            JsonFile(os.path.join(root, 'state.json')).write({'x': 1})
        finally:
            FILE_SAVED.disconnect(on_saved)
            shutil.rmtree(root, True)

        assert saved == [os.path.join(root, 'state.json')]


if __name__ == '__main__':
    unittest.main()
