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
from otmetki.core.replay_file import MAGIC, read_header
from otmetki.core.storage import MemoryFile
from otmetki.features.replay_manager.i18n import STRINGS
from otmetki.features.replay_manager.model import (AnalysisWatch, AutoNamer, PageContext, ReplayActionError, ReplayLibrary, UploadedIndex,
                                                   analysis_notice, battle_type, build_page, compatible, find_own, item_of, launch_request,
                                                   name_values, page_status, parse_statuses, pending_launch, play_refusal, rename_target,
                                                   render_name, vehicle_label, vehicle_parts, version_key)
from otmetki.features.replay_manager.model.constants import (ANALYSIS_IDS_PER_READ, ANALYSIS_WATCH_S, FAVOURITES_MAX, INDEX_MAX, LAUNCH_TTL_S,
                                                             SCAN_MAX_FILES)
from otmetki.features.replay_manager.settings import SCHEMA, SETTINGS

ACCOUNT = 1234
CLIENT = '1.45.0.0'
PAGE_FIXTURE = os.path.join(_support.MODPACK_DIR, 'ui-web', 'src', 'entities', 'replays', '_tests', 'fixtures', 'replays-page.sample.json')


def replay_bytes(player_id, arena_id=None, map_title='Прохоровка', vehicle='ussr-R04_T-34', results=None, version=CLIENT):
    arena = {'playerID': player_id, 'dateTime': '27.09.2026 14:05:00', 'mapName': '05_prohorovka', 'mapDisplayName': map_title,
             'playerVehicle': vehicle, 'battleType': 1, 'gameplayID': 'ctf', 'clientVersionFromExe': version}
    if arena_id is not None:
        arena['arenaUniqueID'] = arena_id
    blocks = [json.dumps(arena).encode('utf-8')]
    if results is not None:
        blocks.append(json.dumps(results).encode('utf-8'))
    data = struct.pack(str('<II'), MAGIC, len(blocks))
    for block in blocks:
        data += struct.pack(str('<I'), len(block)) + block
    return data + b'\x00' * 32


def own_results(arena_id, damage=2150, team=2, winner=2):
    own = {'team': team, 'damageDealt': damage, 'damageAssistedRadio': 400, 'damageAssistedTrack': 120, 'damageAssistedStun': 0,
           'kills': 2, 'xp': 1150, 'originalXP': 575, 'credits': 45000, 'spotted': 3, 'markOfMastery': 2, 'marksOnGun': 1, 'shots': 9,
           'directEnemyHits': 8, 'piercingEnemyHits': 7, 'damageReceived': 900, 'damageBlockedByArmor': 1200, 'lifeTime': 400,
           'typeCompDescr': 1, 'deathReason': -1}
    return [{'arenaUniqueID': arena_id, 'common': {'winnerTeam': winner, 'duration': 402, 'bonusType': 1, 'finishReason': 1},
             'personal': {'avatar': {'team': team}, '1': own}, 'vehicles': {'9': [{'damageDealt': 99999}]}}, {}, {}]


class Folder(object):

    def __init__(self):
        self.path = tempfile.mkdtemp()

    def write(self, name, data, mtime):
        path = os.path.join(self.path, name)
        with open(path, 'wb') as handle:
            handle.write(data)
        os.utime(path, (mtime, mtime))
        return path

    def remove(self):
        shutil.rmtree(self.path, ignore_errors=True)


class LibraryTest(unittest.TestCase):

    def setUp(self):
        self.folder = Folder()
        self.folder.write('own_new.mtreplay', replay_bytes(ACCOUNT, 111, results=own_results(111)), 200)
        self.folder.write('own_old.wotreplay', replay_bytes(ACCOUNT), 100)
        self.folder.write('other.mtreplay', replay_bytes(999, 222), 300)
        self.folder.write('temp.mtreplay', replay_bytes(ACCOUNT, 333), 400)
        self.folder.write('broken.mtreplay', b'nope', 500)
        self.folder.write('notes.txt', b'x', 600)
        self.reads = []

    def tearDown(self):
        self.folder.remove()

    def read(self, path):
        self.reads.append(os.path.basename(path))
        return read_header(path)

    def library(self, store=None):
        library = ReplayLibrary(store or MemoryFile(), self.read)
        library.scan(self.folder.path)
        return library

    def test_only_own_replays_newest_first_after_indexing(self):
        library = self.library()
        assert library.indexing() and library.progress() == (0, 4)
        assert library.replays(ACCOUNT) == []
        library.index(time.time, budget_s=60)
        assert not library.indexing() and library.progress() == (4, 4)
        replays = library.replays(ACCOUNT)
        assert [replay['name'] for replay in replays] == ['own_new.mtreplay', 'own_old.wotreplay']
        assert replays[0]['header']['arena_unique_id'] == '111' and replays[0]['header']['stats']['kills'] == 2
        assert library.replays(None) == []

    def test_index_reads_at_least_one_file_per_slice(self):
        library = self.library()
        assert library.index(lambda: 0.0 if not self.reads else 10.0, budget_s=1) == 1
        assert library.progress() == (1, 4)

    def test_headers_persist_and_only_changed_files_are_read_again(self):
        store = MemoryFile()
        library = self.library(store)
        library.index(time.time, budget_s=60)
        assert library.save() and not library.save()
        count = len(self.reads)
        again = self.library(store)
        assert not again.indexing() and len(self.reads) == count
        assert [replay['name'] for replay in again.replays(ACCOUNT)] == ['own_new.mtreplay', 'own_old.wotreplay']
        self.folder.write('own_old.wotreplay', replay_bytes(ACCOUNT, 555), 150)
        again.scan(self.folder.path)
        again.index(time.time, budget_s=60)
        assert self.reads[count:] == ['own_old.wotreplay']

    def test_missing_folder_and_deleted_files(self):
        store = MemoryFile()
        library = self.library(store)
        library.index(time.time, budget_s=60)
        library.save()
        library.scan(os.path.join(self.folder.path, 'missing'))
        assert library.replays(ACCOUNT) == [] and library.progress() == (0, 0)
        assert library.save() and store.read()['files'] == {}

    def test_rename_and_forget_keep_the_read_header(self):
        library = self.library()
        library.index(time.time, budget_s=60)
        library.moved('own_new.mtreplay', 'best.mtreplay', os.path.join(self.folder.path, 'best.mtreplay'))
        assert [replay['name'] for replay in library.replays(ACCOUNT)] == ['best.mtreplay', 'own_old.wotreplay']
        library.forget('best.mtreplay')
        assert [replay['name'] for replay in library.replays(ACCOUNT)] == ['own_old.wotreplay']

    def test_find_own(self):
        library = self.library()
        library.index(time.time, budget_s=60)
        replays = library.replays(ACCOUNT)
        assert find_own(replays, 'own_old.wotreplay')['name'] == 'own_old.wotreplay'
        assert find_own(replays, 'other.mtreplay') is None
        assert find_own(replays, '../own_new.mtreplay') is None

    def test_scan_keeps_the_newest_files(self):
        names = ['r%04d.mtreplay' % number for number in range(SCAN_MAX_FILES + 5)]

        class Info(object):
            def __init__(self, number):
                self.st_size, self.st_mtime = 10, float(number)

        library = ReplayLibrary(MemoryFile(), lambda path: None)
        library.scan('x', listdir=lambda folder: names, stat=lambda path: Info(int(os.path.basename(path)[1:5])))
        assert library.progress() == (0, SCAN_MAX_FILES) and 'r0000.mtreplay' not in library.files

    def test_a_stored_cache_of_another_layout_is_ignored(self):
        assert ReplayLibrary(MemoryFile({'v': 1, 'files': {'a.mtreplay': {'stamp': [1, 1], 'header': {}}}})).entries == {}
        assert ReplayLibrary(MemoryFile(['junk'])).entries == {}


class PageTest(unittest.TestCase):

    def replay(self, name='a.mtreplay', header=None, size=2 * 1024 * 1024, mtime=1790000000.0):
        return {'name': name, 'path': name, 'size': size, 'mtime': mtime, 'header': header}

    def header(self):
        folder = Folder()
        try:
            path = folder.write('x.mtreplay', replay_bytes(ACCOUNT, 111, results=own_results(111)), 100)
            return read_header(path)
        finally:
            folder.remove()

    def context(self, **values):
        index = UploadedIndex(MemoryFile())
        index.add('111', '7b0c2a44-1111-4111-8111-111111111111')
        index.set_favourite('111', True)
        defaults = {'index': index, 'client_version': CLIENT, 'upload': 'ready',
                    'describe_vehicle': lambda tank_id, vehicle: {'label': u'Т-34', 'tier': 5, 'cls': 'mediumTank'},
                    'image': lambda path: 'img://' + path}
        defaults.update(values)
        return PageContext(**defaults)

    def test_item_carries_the_own_results_and_the_client_images(self):
        item = item_of(self.replay(header=self.header()), self.context())
        assert (item['id'], item['title'], item['map'], item['map_title']) == ('a.mtreplay', 'a', '05_prohorovka', u'Прохоровка')
        assert (item['tank'], item['tier'], item['cls'], item['nation']) == (u'Т-34', 5, 'mediumTank', 'ussr')
        assert (item['result'], item['damage'], item['assist'], item['kills'], item['xp']) == ('win', 2150, 520, 2, 1150)
        assert (item['type'], item['playable'], item['favourite'], item['survived']) == ('random', True, True, True)
        assert item['map_image'] == 'img://gui/maps/icons/map/stats/05_prohorovka.png'
        assert item['map_thumb'] == 'img://gui/maps/icons/map/small/05_prohorovka.png'
        assert item['tank_image'] == 'img://gui/maps/icons/vehicle/ussr-R04_T-34.png'
        assert item['mastery_image'] == 'img://gui/maps/icons/library/proficiency/class_icons_2_small.png'
        assert item['site'] == {'state': 'uploaded', 'link': '/replays/7b0c2a44-1111-4111-8111-111111111111'}

    def test_item_without_results_or_client_lookups(self):
        header = dict(self.header(), result=None, damage=None, stats=None, arena_unique_id=None, client_version='1.44.1.0')
        item = item_of(self.replay(header=header), PageContext(client_version=CLIENT))
        assert (item['result'], item['damage'], item['kills'], item['mastery'], item['survived']) == (None, None, None, None, None)
        assert (item['tank'], item['tier'], item['map_image'], item['site'], item['favourite']) == ('T-34', None, None, None, False)
        assert item['playable'] is False and item['version'] == '1.44.1.0'

    def test_site_states(self):
        context = self.context(queued={'222'}, analysed={'7b0c2a44-1111-4111-8111-111111111111'})
        assert item_of(self.replay(header=self.header()), context)['site']['state'] == 'analysed'
        queued = dict(self.header(), arena_unique_id='222')
        assert item_of(self.replay(header=queued), context)['site'] == {'state': 'queued', 'link': None}

    def test_battle_types_and_names(self):
        assert battle_type({'battle_type': 22}) == 'ranked' and battle_type({'battle_type': 43}) == 'comp7'
        assert battle_type({'battle_type': 52}) == 'other' and battle_type({}) == 'other'
        assert vehicle_parts('germany-G04_PzVI_Tiger_I') == ('germany', 'G04_PzVI_Tiger_I')
        assert vehicle_parts('../x') == (None, None) and vehicle_parts(None) == (None, None)
        assert vehicle_label('germany-G04_PzVI_Tiger_I') == 'PzVI Tiger I' and vehicle_label('usa-A175_OTAC_MT_58_02') == 'OTAC MT 58 02'

    def test_page_and_its_fixture(self):
        now = 1790507100.0
        header = dict(self.header(), date_time=now)
        early = dict(header, arena_unique_id='555', result=None, damage=None, stats=None, client_version='1.44.1.0', date_time=now - 57300,
                     map_name='02_malinovka', map_title=u'Малиновка', vehicle='germany-G04_PzVI_Tiger_I', battle_type=22)
        vehicles = {'ussr-R04_T-34': {'label': u'Т-34', 'tier': 5, 'cls': 'mediumTank'},
                    'germany-G04_PzVI_Tiger_I': {'label': u'Tiger I', 'tier': 7, 'cls': 'heavyTank'}}
        replays = [self.replay('20260927_1405_ussr-R04_T-34_05_prohorovka.mtreplay', header, mtime=now),
                   self.replay('20260926_2210_germany-G04_PzVI_Tiger_I_02_malinovka.mtreplay', early, size=900000, mtime=now - 90000)]
        context = self.context(queued={'555'}, describe_vehicle=lambda tank_id, vehicle: vehicles[vehicle])

        class Library(object):
            @staticmethod
            def indexing():
                return False

        page = build_page(replays, context, page_status(ACCOUNT, Library), (2, 2), 'C:/Games/Tanki/replays')
        assert page['kind'] == 'replays' and page['status'] == 'ready' and page['progress'] == {'done': 2, 'total': 2}
        assert [item['id'] for item in page['items']] == [replay['name'] for replay in replays]
        assert page_status(None, Library) == 'no_account'
        text = json.dumps(page, sort_keys=True, indent=2, ensure_ascii=False) + '\n'
        if os.environ.get('OTMETKI_UPDATE_FIXTURES') == '1':
            directory = os.path.dirname(PAGE_FIXTURE)
            if not os.path.isdir(directory):
                os.makedirs(directory)
            with io.open(PAGE_FIXTURE, 'w', encoding='utf-8', newline='\n') as handle:
                handle.write(text if isinstance(text, type(u'')) else text.decode('utf-8'))
        assert _support.load_json(PAGE_FIXTURE) == json.loads(json.dumps(page))


class PlayTest(unittest.TestCase):

    def replay(self, version=CLIENT):
        return {'name': 'a.mtreplay', 'path': 'a.mtreplay', 'header': {'client_version': version}}

    def test_versions(self):
        assert version_key('1.45.0.0') == (1, 45, 0, 0) and version_key(u'«Мир танков» v.1.45.0.0 #2284') == (1, 45, 0, 0)
        assert version_key('1.45') is None and version_key(None) is None
        assert compatible('1.45.0.0', '1.45.0.0') and not compatible('1.45.0.1', '1.45.0.0') and not compatible('1.44.1.0', '1.45.0.0')
        assert not compatible(None, '1.45.0.0') and not compatible('1.45.0.0', None)

    def test_guards_in_order(self):
        assert play_refusal(self.replay(), CLIENT, False, False, True) is None
        assert play_refusal(self.replay(), CLIENT, False, False, False) == 'unavailable'
        assert play_refusal(self.replay(), CLIENT, True, False, True) == 'battle'
        assert play_refusal(self.replay(), CLIENT, False, True, True) == 'playing'
        assert play_refusal(None, CLIENT, False, False, True) == 'missing'
        assert play_refusal(self.replay('1.44.1.0'), CLIENT, False, False, True) == 'version'
        assert play_refusal(self.replay(), None, False, False, True) == 'version'

    def test_launch_request_is_played_once_and_only_while_fresh(self):
        request = launch_request(u'C:/Игры/replays/a.mtreplay', 1000.0)
        assert pending_launch(request, 1010.0, lambda path: True) == u'C:/Игры/replays/a.mtreplay'
        assert pending_launch(request, 1000.0 + LAUNCH_TTL_S + 1, lambda path: True) is None
        assert pending_launch(request, 990.0, lambda path: True) is None
        assert pending_launch(request, 1010.0, lambda path: False) is None
        assert pending_launch(launch_request('C:/replays/temp.mtreplay', 1000.0), 1010.0, lambda path: True) is None
        assert pending_launch(launch_request('C:/replays/notes.txt', 1000.0), 1010.0, lambda path: True) is None
        for junk in (None, [], {'path': 5, 'at': 1000.0}, {'path': 'a.mtreplay'}):
            assert pending_launch(junk, 1010.0, lambda path: True) is None


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

    def test_favourites(self):
        store = MemoryFile({'uploaded': [['1', 'a']]})
        index = UploadedIndex(store)
        assert index.get('1') == 'a' and not index.is_favourite('1')
        assert index.set_favourite('1', True) and not index.set_favourite('1', True) and not index.set_favourite('', True)
        index.moved('1', '2')
        assert UploadedIndex(store).favourites == ['2'] and UploadedIndex(store).get('1') == 'a'
        assert index.set_favourite('2', False) and not UploadedIndex(store).is_favourite('2')
        for number in range(FAVOURITES_MAX + 3):
            index.set_favourite(str(number), True)
        assert len(UploadedIndex(store).favourites) == FAVOURITES_MAX
        assert UploadedIndex(MemoryFile({'uploaded': [['1'], 5], 'favourites': [5, '', 'x']})).favourites == ['x']

    def test_settings(self):
        assert SETTINGS == ('hangar_replay_manager',)
        assert SCHEMA.defaults['auto_rename'] is False
        assert len(SCHEMA.coerce('name_template', 'x' * 500)) == 100
        assert set(SCHEMA.defaults) == {'notify_analysis', 'auto_rename', 'name_template'}

    def test_every_setting_has_a_label_in_both_languages(self):
        for language in ('ru', 'en'):
            for key in SCHEMA.defaults:
                assert 'replay_manager_%s' % key in STRINGS[language]
        assert set(STRINGS['ru']) == set(STRINGS['en'])


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
