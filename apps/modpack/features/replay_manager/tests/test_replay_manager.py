# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import json
import os
import shutil
import struct
import tempfile
import unittest

import _support  # noqa: F401
from otmetki.core.i18n import Catalog, Translator
from otmetki.core.replay_file import MAGIC
from otmetki.core.storage import MemoryFile
from otmetki.features.replay_manager.i18n import STRINGS
from otmetki.features.replay_manager.model import (HeaderCache, ReplayActionError, UploadedIndex, build_page, find_own, own_replays,
                                                   rename_target)
from otmetki.features.replay_manager.model.constants import INDEX_MAX
from otmetki.features.replay_manager.settings import SCHEMA, SETTINGS

ACCOUNT = 1234


def replay_bytes(player_id, arena_id=None, map_title='Прохоровка', vehicle='ussr-R04_T-34'):
    blocks = [json.dumps({'playerID': player_id, 'dateTime': '27.09.2026 14:05:00', 'mapName': '05_prohorovka',
                          'mapDisplayName': map_title, 'playerVehicle': vehicle}).encode('utf-8')]
    if arena_id is not None:
        blocks.append(json.dumps([{'arenaUniqueID': arena_id}]).encode('utf-8'))
    data = struct.pack(str('<II'), MAGIC, len(blocks))
    for block in blocks:
        data += struct.pack(str('<I'), len(block)) + block
    return data + b'\x00' * 32


class ReplayFolderTest(unittest.TestCase):

    def setUp(self):
        self.folder = tempfile.mkdtemp()
        self.write('own_new.mtreplay', replay_bytes(ACCOUNT, 111), 200)
        self.write('own_old.wotreplay', replay_bytes(ACCOUNT), 100)
        self.write('other.mtreplay', replay_bytes(999, 222), 300)
        self.write('temp.mtreplay', replay_bytes(ACCOUNT, 333), 400)
        self.write('broken.mtreplay', b'nope', 500)
        self.write('notes.txt', b'x', 600)

    def tearDown(self):
        shutil.rmtree(self.folder, ignore_errors=True)

    def write(self, name, data, mtime):
        path = os.path.join(self.folder, name)
        with open(path, 'wb') as handle:
            handle.write(data)
        os.utime(path, (mtime, mtime))

    def test_only_own_replays_newest_first(self):
        replays = own_replays(self.folder, ACCOUNT, HeaderCache())
        assert [replay['name'] for replay in replays] == ['own_new.mtreplay', 'own_old.wotreplay']
        assert replays[0]['header']['arena_unique_id'] == '111'
        assert replays[0]['header']['map_title'] == u'Прохоровка'
        assert own_replays(self.folder, None, HeaderCache()) == []
        assert own_replays(os.path.join(self.folder, 'missing'), ACCOUNT, HeaderCache()) == []

    def test_cache_rereads_only_changed_files(self):
        reads = []

        def read(path):
            reads.append(os.path.basename(path))
            from otmetki.core.replay_file import read_header
            return read_header(path)

        cache = HeaderCache(read)
        own_replays(self.folder, ACCOUNT, cache)
        count = len(reads)
        own_replays(self.folder, ACCOUNT, cache)
        assert len(reads) == count
        self.write('own_new.mtreplay', replay_bytes(ACCOUNT, 111), 250)
        own_replays(self.folder, ACCOUNT, cache)
        assert reads[count:] == ['own_new.mtreplay']

    def test_page_links_uploaded_replays_to_the_site(self):
        index = UploadedIndex(MemoryFile())
        index.add('111', '7b0c2a44-1111-4111-8111-111111111111')
        translate = Translator(Catalog(STRINGS), 'ru')
        page = build_page(own_replays(self.folder, ACCOUNT, HeaderCache()), index, translate, 50, False)
        first, second = page['rows']
        assert first['link'] == '/replays/7b0c2a44-1111-4111-8111-111111111111'
        assert first['badge'] == u'На сайте'
        assert first['title'] == u'Прохоровка - T-34'
        assert [action['id'] for action in first['actions']] == ['site', 'rename', 'delete']
        assert first['actions'][1]['input'] == 'own_new'
        assert second['link'] is None and second['badge'] is None
        only_uploaded = build_page(own_replays(self.folder, ACCOUNT, HeaderCache()), index, translate, 50, True)
        assert [row['id'] for row in only_uploaded['rows']] == ['own_new.mtreplay']
        assert build_page([], index, translate, 50, False)['rows'] == []

    def test_find_own(self):
        replays = own_replays(self.folder, ACCOUNT, HeaderCache())
        assert find_own(replays, 'own_old.wotreplay')['name'] == 'own_old.wotreplay'
        assert find_own(replays, 'other.mtreplay') is None
        assert find_own(replays, '../own_new.mtreplay') is None


class RenameTest(unittest.TestCase):

    def test_safe_names_keep_the_extension(self):
        assert rename_target('a.mtreplay', u'  Мой  лучший бой ') == u'Мой лучший бой.mtreplay'
        assert rename_target('a.mtreplay', 'x/../..\\y:z') == 'x .. .. y z.mtreplay'
        assert rename_target('a.wotreplay', 'best.wotreplay') == 'best.wotreplay'
        assert rename_target('a.mtreplay', 'b' * 300) == 'b' * 100 + '.mtreplay'

    def test_bad_names(self):
        for title in ('', '   ', '...', 'CON', 'lpt1', None, 42):
            with self.assertRaises(ReplayActionError):
                rename_target('a.mtreplay', title)


class IndexAndSettingsTest(unittest.TestCase):

    def test_index_persists_and_is_bounded(self):
        store = MemoryFile()
        index = UploadedIndex(store)
        assert not index.add('1', None) and not index.add(None, 'x')
        for arena in range(INDEX_MAX + 5):
            index.add(str(arena), 'id-%d' % arena)
        again = UploadedIndex(store)
        assert again.get('0') is None and again.get(str(INDEX_MAX + 4)) == 'id-%d' % (INDEX_MAX + 4)
        assert len(again.items) == INDEX_MAX

    def test_settings(self):
        assert SETTINGS == ('hangar_replay_manager',)
        assert SCHEMA.coerce('max_rows', 5000) == 200


if __name__ == '__main__':
    unittest.main()
