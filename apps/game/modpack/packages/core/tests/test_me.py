# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import unittest

import _support
from otmetki.companion.binding import Credentials
from otmetki.core.errors import ReasonError
from otmetki.core.me import (MAX_RETRY_S, MAX_TANKS, RETRY_AFTER_ERROR_S, RETRY_AFTER_LIMIT_S, ReadState, device_body, expected, is_auth_failure,
                             owned, records, retry_delay, tank_ids, tank_key, tank_rows, tanks_request)

ACCOUNT = 12345678
CREDENTIALS = Credentials('dev_me', 's' * 40, ACCOUNT)
T0 = 1790000000.0


def tanks_example():
    data = _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'ratings-tanks.example.json'))
    data['account_id'] = ACCOUNT
    return data


class RequestsTest(unittest.TestCase):

    def test_bodies_need_a_bound_device(self):
        assert device_body(CREDENTIALS) == {'device_id': 'dev_me', 'account_id': ACCOUNT}
        with self.assertRaises(ReasonError) as caught:
            device_body(Credentials('dev_me', 'short', ACCOUNT))
        assert caught.exception.reason == 'not_bound'
        with self.assertRaises(ReasonError):
            tanks_request(CREDENTIALS, [0, 'x'])

    def test_tank_ids_are_unique_valid_and_capped(self):
        assert tank_ids([3, 3, -1, True, 7]) == [3, 7]
        assert len(tanks_request(CREDENTIALS, range(1, MAX_TANKS + 20))['tank_ids']) == MAX_TANKS
        assert tank_key(5) == 'tank:5'

    def test_statuses_and_delays(self):
        assert is_auth_failure(401) and is_auth_failure(403) and not is_auth_failure(429)
        assert retry_delay(429, 30) == 30.0 and retry_delay(429, 10 ** 7) == MAX_RETRY_S
        assert retry_delay(429) == RETRY_AFTER_LIMIT_S and retry_delay(500, 30) == RETRY_AFTER_ERROR_S


class ParseTest(unittest.TestCase):

    def test_rows_with_records_and_expected_values(self):
        rows = tank_rows(tanks_example(), ACCOUNT)
        assert rows[1]['records'] == {'damage': 6812, 'assist': 5120, 'frags': 6, 'xp': 2740}
        assert rows[1]['expected']['win_rate'] == 52.3
        assert rows[2849]['records'] is None and rows[2849]['expected'] is None

    def test_another_account_and_bad_values_are_dropped(self):
        assert tank_rows(tanks_example(), ACCOUNT + 1) == {}
        assert not owned(None, ACCOUNT) and not owned({'account_id': ACCOUNT}, None)
        assert records({'max_damage': -5, 'max_assist': 'x'}) is None
        assert records({'max_damage': 10}) == {'damage': 10, 'assist': None, 'frags': None, 'xp': None}
        assert expected({'damage': 0, 'spot': 1, 'frag': 1, 'def': 1, 'win_rate': 50}) is None
        assert expected({'damage': 1000, 'spot': 1, 'frag': 1, 'win_rate': 50}) is None
        assert expected(['nope']) is None


class ReadStateTest(unittest.TestCase):

    def test_once_never_twice_at_once_and_again_when_stale(self):
        reads = ReadState()
        assert reads.wants('k', T0)
        reads.start(['k'])
        assert not reads.wants('k', T0)
        reads.done(['k'])
        assert not reads.wants('k', T0 + 10 ** 6)
        reads.stale(['k'], T0, 20)
        assert not reads.wants('k', T0 + 19) and reads.wants('k', T0 + 20)

    def test_failure_delay_expedite_and_refresh(self):
        reads = ReadState()
        reads.start(['k'])
        reads.fail(['k'], T0, 60)
        assert not reads.wants('k', T0 + 59)
        reads.expedite('k')
        assert reads.wants('k', T0)
        reads.done(['k'])
        reads.expedite('k')
        assert not reads.wants('k', T0)
        reads.refresh_all()
        assert reads.wants('k', T0)


if __name__ == '__main__':
    unittest.main()
