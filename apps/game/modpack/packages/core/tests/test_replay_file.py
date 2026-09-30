# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import struct
import unittest

import _support
from otmetki.core.replay_file import MAGIC, own_outcome, own_stats, read_header_from

ARENA = {'playerID': 36306577, 'playerName': 'Zilero', 'dateTime': '28.09.2026 00:13:29', 'mapName': '127_japort',
         'mapDisplayName': u'Старая гавань', 'playerVehicle': 'ussr-R45_IS-7', 'battleType': 1, 'gameplayID': 'ctf',
         'clientVersionFromExe': '1.45.0.0', 'clientVersionFromXml': u'«Мир танков» v.1.45.0.0 #2284', 'serverName': 'RU1',
         'arenaUniqueID': 214987871146837746, 'vehicles': {'9': {'name': 'enemy', 'team': 2, 'vehicleType': 'germany:G04_PzVI_Tiger_I'}}}


def replay(*blocks):
    data = struct.pack(str('<II'), MAGIC, len(blocks))
    for block in blocks:
        raw = json.dumps(block).encode('utf-8')
        data += struct.pack(str('<I'), len(raw)) + raw
    return io.BytesIO(data + b'\x00' * 16)


def results():
    data = _support.fixture('battle_results_random.json')
    return [data, {}, {}]


class HeaderTest(unittest.TestCase):

    def test_arena_block_of_a_battle_left_early(self):
        header = read_header_from(replay(ARENA))
        assert header['player_id'] == 36306577 and header['player_name'] == 'Zilero'
        assert header['arena_unique_id'] == '214987871146837746'
        assert (header['map_name'], header['map_title'], header['vehicle']) == ('127_japort', u'Старая гавань', 'ussr-R45_IS-7')
        assert (header['battle_type'], header['gameplay'], header['client_version'], header['server']) == (1, 'ctf', '1.45.0.0', 'RU1')
        assert (header['result'], header['damage'], header['stats']) == (None, None, None)
        assert header['date_time'] is not None

    def test_results_block_gives_the_own_outcome_and_numbers(self):
        header = read_header_from(replay(dict(ARENA, arenaUniqueID=None), results()))
        assert header['arena_unique_id'] == str(_support.fixture('battle_results_random.json')['arenaUniqueID'])
        assert (header['result'], header['damage']) == ('win', 2150)
        stats = header['stats']
        assert (stats['assist'], stats['assist_radio'], stats['assist_track'], stats['kills'], stats['xp']) == (950, 640, 310, 2, 1150)
        assert (stats['duration'], stats['bonus_type'], stats['survived'], stats['tank_id']) == (402, 1, True, 1)
        assert 'mastery' not in stats

    def test_only_the_recorders_own_entry_is_read(self):
        data = _support.fixture('battle_results_random.json')
        data['vehicles'] = {'9': [{'damageDealt': 99999, 'kills': 15, 'team': 2}]}
        data['players'] = {'1': {'name': 'someone'}}
        stats = own_stats(data)
        assert stats['kills'] == 2 and 99999 not in stats.values()
        assert own_outcome({'personal': {'avatar': {'team': 1}}}) == (None, None)
        assert own_stats({'personal': {'avatar': {'team': 1}}}) is None

    def test_values_of_the_wrong_type_are_left_out(self):
        data = _support.fixture('battle_results_random.json')
        own = data['personal']['1']
        own.update({'kills': '2', 'xp': True, 'deathReason': None})
        stats = own_stats(data)
        assert 'kills' not in stats and 'xp' not in stats and stats['survived'] is None

    def test_a_draw_and_a_loss(self):
        data = _support.fixture('battle_results_random.json')
        data['common']['winnerTeam'] = 0
        assert own_outcome(data)[0] == 'draw'
        data['common']['winnerTeam'] = 2
        assert own_outcome(data)[0] == 'loss'

    def test_not_a_replay(self):
        assert read_header_from(io.BytesIO(b'\x00' * 16)) is None
        assert read_header_from(replay('text')) is None
        assert read_header_from(replay(dict(ARENA, arenaUniqueID=True)))['arena_unique_id'] is None


if __name__ == '__main__':
    unittest.main()
