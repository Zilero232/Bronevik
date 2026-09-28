# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import os
import shutil
import struct
import tempfile
import time
import unittest

import _support
from otmetki.core.replay_file import MAGIC
from otmetki.core.settings import Settings
from otmetki.core.storage import MemoryFile
from otmetki.features.replay_manager.i18n import STRINGS
from otmetki.core.replay_file import read_header_from
from otmetki.features.replay_manager.model import (AnalysisWatch, AutoNamer, HeaderCache, ReplayActionError, UploadedIndex, analysis_notice, arrange,
                                                   build_page, find_own, matches, name_values, own_replays, parse_statuses, rename_target,
                                                   render_name)
from otmetki.features.replay_manager.model.constants import ANALYSIS_IDS_PER_READ, ANALYSIS_WATCH_S
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
        translate = _support.translator(STRINGS)
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
        assert SCHEMA.defaults['auto_rename'] is False
        assert len(SCHEMA.coerce('name_template', 'x' * 500)) == 100


STARTED = time.mktime((2026, 9, 27, 14, 5, 0, 0, 0, -1))


def own_event(arena='777'):
    return {'arena_unique_id': arena, 'arena_created_at': int(STARTED), 'occurred_at': int(STARTED) + 400, 'result': 'win',
            'map_name': '05_prohorovka', 'vehicle': {'tank_id': 1, 'tier': 5}, 'stats': {'damage_dealt': 2150, 'xp': 1150, 'frags': 2}}


def replay(name, arena=None, started=None, mtime=STARTED + 400):
    return {'name': name, 'path': name, 'size': 1, 'mtime': mtime, 'header': {'arena_unique_id': arena, 'date_time': started}}


class AutoNameTest(unittest.TestCase):

    def values(self):
        return name_values(own_event(), u'Прохоровка', u'Т-34', u'победа')

    def test_values_and_name(self):
        values = self.values()
        assert (values['date'], values['time'], values['damage']) == ('2026-09-27', '14-05', 2150)
        name = render_name('{date}_{time}_{map}_{vehicle}_{result}_{damage}', values, 'old.mtreplay')
        assert name == u'2026-09-27_14-05_Прохоровка_Т-34_победа_2150.mtreplay'
        assert render_name('{vehicle}: <bad>?', values, 'a.wotreplay') == u'Т-34 bad.wotreplay'
        assert render_name('   ', values, 'a.mtreplay') is None

    def test_matching_by_arena_then_time(self):
        namer = AutoNamer()
        assert namer.queue(own_event('777'), self.values(), 0.0)
        assert not namer.queue(own_event('777'), self.values(), 0.0)
        replays = [replay('other.mtreplay', arena='555'), replay('mine.mtreplay', arena='777')]
        assert [(item[0]['name'], item[1]) for item in namer.plan(replays, '{result}', STARTED + 500)] == [('mine.mtreplay', u'победа.mtreplay')]
        assert namer.pending == []
        namer.queue(own_event('778'), self.values(), 0.0)
        by_time = [replay('left_early.mtreplay', started=STARTED + 60)]
        assert namer.plan(by_time, '{map}', STARTED + 500)[0][1] == u'Прохоровка.mtreplay'

    def test_waits_for_the_file_and_gives_up(self):
        namer = AutoNamer()
        namer.queue(own_event(), self.values(), STARTED)
        fresh = [replay('mine.mtreplay', arena='777', mtime=STARTED + 495)]
        assert namer.plan(fresh, '{result}', STARTED + 500) == [] and len(namer.pending) == 1
        assert namer.plan([], '{result}', STARTED + 3 * 3600) == [] and namer.pending == []


def listed(name, map_title, vehicle, date_time, result=None, damage=None, size=1000):
    header = {'map_title': map_title, 'map_name': None, 'vehicle': vehicle, 'date_time': date_time, 'result': result, 'damage': damage,
              'arena_unique_id': None, 'player_id': ACCOUNT}
    return {'name': name, 'path': name, 'size': size, 'mtime': date_time, 'header': header}


def filters(**values):
    return Settings(values, SCHEMA)


class HeaderOutcomeTest(unittest.TestCase):

    def test_reads_only_the_recorders_own_result_and_damage(self):
        results = [{'arenaUniqueID': 5, 'common': {'winnerTeam': 2},
                    'personal': {'avatar': {'team': 1}, '1': {'team': 2, 'damageDealt': 2150}}}, {'other': {'damageDealt': 9999}}]
        blocks = [json.dumps({'playerID': ACCOUNT, 'dateTime': '27.09.2026 14:05:00'}).encode('utf-8'), json.dumps(results).encode('utf-8')]
        data = struct.pack(str('<II'), MAGIC, len(blocks))
        for block in blocks:
            data += struct.pack(str('<I'), len(block)) + block
        header = read_header_from(io.BytesIO(data))
        assert (header['result'], header['damage']) == ('win', 2150)
        results[0]['common']['winnerTeam'] = 0
        blocks[1] = json.dumps(results).encode('utf-8')
        data = struct.pack(str('<II'), MAGIC, len(blocks)) + b''.join(struct.pack(str('<I'), len(block)) + block for block in blocks)
        assert read_header_from(io.BytesIO(data))['result'] == 'draw'


class FiltersTest(unittest.TestCase):

    def setUp(self):
        now = 1790000000
        self.now = now
        self.replays = [
            listed('a.mtreplay', u'Прохоровка', 'ussr-R04_T-34', now - 600, 'win', 2150, 3000),
            listed('b.mtreplay', u'Химмельсдорф', 'germany-G04_PzVI_Tiger_I', now - 3 * 24 * 3600, 'loss', 3400, 1000),
            listed('c.wotreplay', u'Малиновка', 'ussr-R04_T-34', now - 40 * 24 * 3600, None, None, 2000),
        ]

    def names(self, **values):
        return [replay['name'] for replay in arrange(self.replays, filters(**values), self.now)]

    def test_search_matches_map_vehicle_and_file_in_any_case(self):
        assert self.names(search=u'прохор') == ['a.mtreplay']
        assert self.names(search='t-34') == ['a.mtreplay', 'c.wotreplay']
        assert self.names(search='C.WOT') == ['c.wotreplay']
        assert self.names(search='nothing') == []

    def test_result_period_and_sort(self):
        assert self.names(filter_result='loss') == ['b.mtreplay']
        assert self.names(filter_result='unknown') == ['c.wotreplay']
        assert self.names(period='today') == ['a.mtreplay']
        assert self.names(period='week') == ['a.mtreplay', 'b.mtreplay']
        assert self.names(sort='oldest') == ['c.wotreplay', 'b.mtreplay', 'a.mtreplay']
        assert self.names(sort='damage') == ['b.mtreplay', 'a.mtreplay', 'c.wotreplay']
        assert self.names(sort='size') == ['a.mtreplay', 'c.wotreplay', 'b.mtreplay']
        assert matches(self.replays[0], filters(period='today'), None)
        assert filters(sort='random', filter_result='maybe').get('sort') == 'newest'

    def test_page_shows_the_outcome_and_a_nothing_found_text(self):
        translate = _support.translator(STRINGS, 'ru')
        index = UploadedIndex(MemoryFile())
        page = build_page(self.replays, index, translate, 50, False, filters(sort='damage'), self.now)
        assert [row['id'] for row in page['rows']] == ['b.mtreplay', 'a.mtreplay', 'c.wotreplay']
        assert u'поражение, урон 3 400' in page['rows'][0]['meta']
        empty = build_page(self.replays, index, translate, 50, False, filters(search='nothing'), self.now)
        assert empty['rows'] == [] and empty['empty'] == STRINGS['ru']['replay_manager_nothing_found']


class AnalysisTest(unittest.TestCase):

    def example(self):
        return _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'replay-analysis.example.json'))

    def test_contract_and_own_account_only(self):
        validator = _support.schema_validator('replay-analysis.schema.json', 'statuses')
        if validator is not None:
            validator.validate(self.example())
        statuses = parse_statuses(self.example(), 12345678)
        assert statuses['0f8e2d4c-6b1a-4f3e-9d2c-7a5b3c1d9e8f'] == ('parsed', {'accuracy': 83.3, 'damage': 2150, 'penetrations': 7})
        assert statuses['5a4b3c2d-1e0f-4a9b-8c7d-6e5f4a3b2c1d'][0] == 'parsing'
        assert parse_statuses(self.example(), 1) == {} and parse_statuses({'account_id': 1, 'replays': [{'id': 5}]}, 1) == {}

    def test_watch_reports_each_finished_analysis_once(self):
        watch = AnalysisWatch()
        watch.add('0f8e2d4c-6b1a-4f3e-9d2c-7a5b3c1d9e8f', 100.0)
        watch.add('5a4b3c2d-1e0f-4a9b-8c7d-6e5f4a3b2c1d', 110.0)
        watch.add(None, 110.0)
        assert watch.due(200.0) == ['0f8e2d4c-6b1a-4f3e-9d2c-7a5b3c1d9e8f', '5a4b3c2d-1e0f-4a9b-8c7d-6e5f4a3b2c1d']
        finished = watch.apply(parse_statuses(self.example(), 12345678))
        assert [replay_id for replay_id, _ in finished] == ['0f8e2d4c-6b1a-4f3e-9d2c-7a5b3c1d9e8f']
        assert watch.apply(parse_statuses(self.example(), 12345678)) == []
        assert watch.due(110.0 + ANALYSIS_WATCH_S + 1) == []
        watch.add('0f8e2d4c-6b1a-4f3e-9d2c-7a5b3c1d9e8f', 300.0)
        assert watch.due(300.0) == []
        for number in range(ANALYSIS_IDS_PER_READ + 5):
            watch.add('id-%02d' % number, 400.0 + number)
        assert len(watch.due(500.0)) == ANALYSIS_IDS_PER_READ and watch.due(500.0)[0] == 'id-00'

    def test_notice(self):
        translate = _support.translator(STRINGS, 'ru')
        assert analysis_notice({'accuracy': 83.3, 'damage': 2150, 'penetrations': 7}, translate) == \
            u'Три отметки: разбор реплея готов на сайте (точность 83%, урон 2 150, пробитий 7)'
        assert analysis_notice({'accuracy': None, 'damage': None, 'penetrations': None}, translate) == u'Три отметки: разбор реплея готов на сайте'


if __name__ == '__main__':
    unittest.main()
