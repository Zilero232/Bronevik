from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import struct
import unittest

import _support  # noqa: F401
from otmetki.core.native_settings import NATIVE, from_table, native_values, tri_state, write_settings
from otmetki.core.replay_file import MAGIC, is_replay_name, read_header_from


class NativeSettingsTest(unittest.TestCase):

    def test_tri_state(self):
        assert (tri_state('on'), tri_state('off'), tri_state(NATIVE), tri_state('bogus')) == (True, False, None, None)

    def test_native_values_skip_native_and_unknown_keys(self):
        fields = {'a': ('clientA', tri_state), 'b': ('clientB', from_table({'x': 1})), 'c': ('clientC', tri_state)}
        assert native_values({'a': 'off', 'b': 'x', 'z': 'on'}, fields) == {'clientA': False, 'clientB': 1}
        assert native_values({'a': NATIVE, 'b': NATIVE}, fields) == {}


class RecordingCore(object):

    def __init__(self):
        self.calls = []

    def applySettings(self, diff):
        self.calls.append(('applySettings', diff))

    def applyStorages(self, restartApproved, force=False):
        self.calls.append(('applyStorages', restartApproved))
        return ['confirmator']

    def confirmChanges(self, confirmators):
        self.calls.append(('confirmChanges', confirmators))

    def clearStorages(self):
        self.calls.append(('clearStorages',))


class WriteSettingsTest(unittest.TestCase):

    def test_order_of_the_game_settings_window(self):
        core = RecordingCore()
        write_settings(core, {'minimapAlpha': 40})
        assert core.calls == [('applySettings', {'minimapAlpha': 40}), ('applyStorages', False), ('confirmChanges', ['confirmator']),
                              ('clearStorages',)]

    def test_no_confirmators_confirms_an_empty_list(self):
        core = RecordingCore()
        core.applyStorages = lambda restartApproved, force=False: None
        write_settings(core, {'a': 1})
        assert ('confirmChanges', []) in core.calls


class ReplayHeaderTest(unittest.TestCase):

    def header(self, blocks, count=None):
        data = struct.pack(str('<II'), MAGIC, len(blocks) if count is None else count)
        for block in blocks:
            raw = json.dumps(block).encode('utf-8')
            data += struct.pack(str('<I'), len(raw)) + raw
        return read_header_from(io.BytesIO(data))

    def test_arena_and_results_blocks(self):
        header = self.header([{'playerID': 5, 'mapName': 'm', 'mapDisplayName': 'Map', 'playerVehicle': 'ussr-R04_T-34',
                               'dateTime': '01.02.2026 03:04:05'}, [{'arenaUniqueID': 42}]])
        assert header['player_id'] == 5 and header['arena_unique_id'] == '42'
        assert (header['map_name'], header['map_title'], header['vehicle']) == ('m', 'Map', 'ussr-R04_T-34')
        assert header['date_time'] is not None

    def test_not_a_replay(self):
        assert read_header_from(io.BytesIO(b'\x00' * 16)) is None
        assert self.header([], count=0) is None
        assert self.header(['text']) is None

    def test_names(self):
        assert is_replay_name('a.MTREPLAY') and is_replay_name('b.wotreplay')
        assert not is_replay_name('temp.mtreplay') and not is_replay_name('a.txt')
        # BattleReplay.record (RU 1.45) falls back to temp1..temp99 while temp.mtreplay is taken.
        assert not is_replay_name('temp1.mtreplay') and not is_replay_name('TEMP99.wotreplay')
        assert is_replay_name('temp100.mtreplay') and is_replay_name('temple.mtreplay')


if __name__ == '__main__':
    unittest.main()
