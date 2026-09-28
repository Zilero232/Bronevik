# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import copy
import json
import os
import unittest

import _support
from otmetki.companion.binding import Credentials
from otmetki.core.errors import ReasonError
from otmetki.core.net.signing import signed_request, verify_request
from otmetki.core.settings import Settings
from otmetki.features.hangar_ratings.i18n import STRINGS
from otmetki.features.hangar_ratings.model import (OVERVIEW_KEY, OVERVIEW_PATH, TANKS_PATH, RatingsCache, layout_of, overview_request, page_actions,
                                                   panel_text, parse_overview, parse_tanks, retry_delay, tank_key, tanks_request)
from otmetki.features.hangar_ratings.model.constants import (MAX_RETRY_S, MAX_TANKS, REFRESH_AFTER_BATTLE_S, RETRY_AFTER_ERROR_S,
                                                             RETRY_AFTER_LIMIT_S, TIER_COLORS)
from otmetki.features.hangar_ratings.settings import SCHEMA, SETTINGS

ACCOUNT = 12345678
CREDENTIALS = Credentials('dev_ratings', 's' * 40, ACCOUNT)
T0 = 1790000000.0


def example(name):
    return _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', name))


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def settings(**values):
    return Settings(values, SCHEMA)


class FakeTransport(object):

    def __init__(self):
        self.sent = []

    def request(self, method, url, headers, body, callback):
        self.sent.append((method, url, headers, body))
        callback(200, b'{}', {})


class RequestTest(unittest.TestCase):

    def test_refuses_to_build_a_request_without_binding(self):
        with self.assertRaises(ReasonError) as caught:
            overview_request(None)
        assert caught.exception.reason == 'not_bound'
        with self.assertRaises(ReasonError):
            tanks_request(Credentials('', 's' * 40, ACCOUNT), [1])

    def test_tank_request_keeps_valid_unique_ids_up_to_the_limit(self):
        body = tanks_request(CREDENTIALS, [5, 5, 0, -1, True, 'x', 7] + list(range(100, 100 + MAX_TANKS)))
        assert body['tank_ids'][:2] == [5, 7] and len(body['tank_ids']) == MAX_TANKS
        assert body['device_id'] == 'dev_ratings' and body['account_id'] == ACCOUNT
        with self.assertRaises(ReasonError) as caught:
            tanks_request(CREDENTIALS, [0, None])
        assert caught.exception.reason == 'no_tanks'

    def test_requests_match_the_contract(self):
        overview = _support.schema_validator('ratings.schema.json', 'overviewRequest')
        tanks = _support.schema_validator('ratings.schema.json', 'tanksRequest')
        if overview is None:
            self.skipTest('jsonschema not installed')
        overview.validate(overview_request(CREDENTIALS))
        tanks.validate(tanks_request(CREDENTIALS, list(range(1, MAX_TANKS + 5))))

    def test_signs_the_body_over_the_ratings_path(self):
        transport = FakeTransport()
        answers = []
        body = json.dumps(tanks_request(CREDENTIALS, [1])).encode('utf-8')
        url = 'https://api.triotmetki.ru' + TANKS_PATH
        signed_request(transport, 'POST', url, CREDENTIALS.device_id, CREDENTIALS.secret, body, 'ua', lambda *args: answers.append(args))
        method, sent_url, headers, sent_body = transport.sent[0]
        assert method == 'POST' and sent_url == url and answers[0][0] == 200
        assert verify_request(CREDENTIALS.secret, 'POST', url, headers, sent_body)
        assert not verify_request(CREDENTIALS.secret, 'POST', 'https://api.triotmetki.ru' + OVERVIEW_PATH, headers, sent_body)

    def test_retry_delays(self):
        assert retry_delay(429, 30) == 30.0
        assert retry_delay(429, 10 ** 6) == MAX_RETRY_S
        assert retry_delay(429, None) == RETRY_AFTER_LIMIT_S
        assert retry_delay(503, 30) == RETRY_AFTER_ERROR_S
        assert retry_delay(0) == RETRY_AFTER_ERROR_S


class ParseTest(unittest.TestCase):

    def test_contract_examples_validate(self):
        for definition, name in (('overview', 'ratings-overview.example.json'), ('tanks', 'ratings-tanks.example.json')):
            validator = _support.schema_validator('ratings.schema.json', definition)
            if validator is None:
                self.skipTest('jsonschema not installed')
            validator.validate(example(name))

    def test_overview_example(self):
        overview = parse_overview(example('ratings-overview.example.json'), ACCOUNT)
        assert overview['nickname'] == 'Tanker_2026'
        assert overview['overall']['battles'] == 18432 and overview['overall']['win_rate'] == 53.41
        assert overview['overall']['wn8'] == {'value': 1850.4, 'tier': 'good'}
        assert overview['session']['is_live'] is True and overview['session']['brone_index'] == {'value': None, 'tier': None}

    def test_answers_about_another_account_are_dropped(self):
        assert parse_overview(example('ratings-overview.example.json'), ACCOUNT + 1) is None
        assert parse_tanks(example('ratings-tanks.example.json'), ACCOUNT + 1) == {}
        assert parse_overview(example('ratings-overview.example.json'), None) is None
        assert parse_overview(['not', 'an', 'object'], ACCOUNT) is None

    def test_tanks_example_and_malformed_values(self):
        data = example('ratings-tanks.example.json')
        data['tanks'].append({'tank_id': 'x'})
        data['tanks'].append({'tank_id': 9, 'battles': -3, 'win_rate': 140, 'marks_on_gun': 5, 'mastery': 7, 'wn8': {'value': 'a', 'tier': 'god'}})
        rows = parse_tanks(data, ACCOUNT)
        assert sorted(rows) == [1, 9, 2849]
        assert rows[1]['moe_percent'] == 86.12 and rows[1]['marks_on_gun'] == 2 and rows[1]['mastery'] == 4
        assert rows[9] == {'tank_id': 9, 'battles': 0, 'win_rate': None, 'avg_damage': None, 'wn8': {'value': None, 'tier': None},
                           'moe_percent': None, 'marks_on_gun': None, 'mastery': 0, 'records': None, 'expected': None}
        assert rows[1]['records'] == {'damage': 6812, 'assist': 5120, 'frags': 6, 'xp': 2740}
        assert rows[1]['expected'] == {'damage': 1180.0, 'spot': 1.42, 'frag': 0.98, 'def': 0.75, 'win_rate': 52.3}

    def test_overview_without_ratings_yet(self):
        overview = parse_overview({'account_id': ACCOUNT, 'nickname': None, 'overall': None, 'session': None}, ACCOUNT)
        assert overview == {'account_id': ACCOUNT, 'nickname': None, 'overall': None, 'session': None}


class CacheTest(unittest.TestCase):

    def test_fetches_once_and_never_twice_in_flight(self):
        cache = RatingsCache(ACCOUNT)
        assert cache.wants(OVERVIEW_KEY, T0)
        cache.start([OVERVIEW_KEY])
        assert not cache.wants(OVERVIEW_KEY, T0)
        cache.store_overview({'account_id': ACCOUNT})
        assert not cache.wants(OVERVIEW_KEY, T0 + 3600) and cache.overview == {'account_id': ACCOUNT}

    def test_failure_waits_before_the_next_try(self):
        cache = RatingsCache(ACCOUNT)
        cache.start([tank_key(1)])
        cache.fail([tank_key(1)], T0, 60)
        assert not cache.wants(tank_key(1), T0 + 59) and cache.wants(tank_key(1), T0 + 60)

    def test_a_battle_refreshes_the_overview_after_a_delay(self):
        cache = RatingsCache(ACCOUNT)
        cache.store_overview({'account_id': ACCOUNT})
        cache.after_battle(T0)
        assert not cache.wants(OVERVIEW_KEY, T0 + REFRESH_AFTER_BATTLE_S - 1)
        assert cache.wants(OVERVIEW_KEY, T0 + REFRESH_AFTER_BATTLE_S)
        assert cache.overview == {'account_id': ACCOUNT}

    def test_ingest_answer_expedites_a_stale_overview_only(self):
        cache = RatingsCache(ACCOUNT)
        cache.after_battle(T0)
        cache.expedite(OVERVIEW_KEY)
        assert cache.wants(OVERVIEW_KEY, T0)
        cache.store_overview(None)
        cache.expedite(OVERVIEW_KEY)
        assert not cache.wants(OVERVIEW_KEY, T0)

    def test_reset_clears_everything(self):
        cache = RatingsCache(ACCOUNT)
        cache.store_overview({'account_id': ACCOUNT})
        cache.refresh_all()
        assert cache.wants(OVERVIEW_KEY, T0)
        cache.reset(ACCOUNT + 1)
        assert cache.overview is None and cache.account_id == ACCOUNT + 1 and cache.wants(OVERVIEW_KEY, T0)


class PanelTest(unittest.TestCase):

    def setUp(self):
        self.overview = parse_overview(example('ratings-overview.example.json'), ACCOUNT)
        self.tank = parse_tanks(example('ratings-tanks.example.json'), ACCOUNT)[1]

    def test_default_panel(self):
        text = panel_text(self.overview, self.tank, u'T-34', settings(), translator())
        assert u'Мои рейтинги' in text and u'Аккаунт:' in text and u'Сессия:' in text and u'T-34' in text
        assert u'1 850' in text and u'53.41% побед' in text and u'18 432 боёв' in text
        assert u'86.12% ★★' in text and u'Мастер' in text
        assert TIER_COLORS['good'] in text and TIER_COLORS['very_good'] in text
        assert u'ЭФФ' not in text

    def test_metric_switches(self):
        text = panel_text(self.overview, self.tank, u'T-34', settings(metric_wn8=False, metric_eff=True, colored=False, metric_mastery=False),
                          translator('en'))
        assert 'WN8' not in text and 'EFF' in text and 'Ace Tanker' not in text
        assert TIER_COLORS['good'] not in text

    def test_lines_switch_off_and_nothing_to_show(self):
        text = panel_text(self.overview, self.tank, u'T-34', settings(show_account=False, show_session=False), translator())
        assert u'Аккаунт:' not in text and u'T-34' in text
        assert panel_text(self.overview, None, None, settings(show_account=False, show_session=False), translator()) is None
        assert panel_text(None, None, None, settings(), translator()) is None

    def test_untracked_account_and_last_session(self):
        overview = copy.deepcopy(self.overview)
        overview['overall'] = None
        overview['session']['is_live'] = False
        text = panel_text(overview, None, None, settings(), translator('en'))
        assert 'appear after' in text and 'Last session:' in text

    def test_empty_session_is_not_shown(self):
        overview = copy.deepcopy(self.overview)
        overview['session']['battles'] = 0
        assert u'Сессия' not in panel_text(overview, None, None, settings(), translator())

    def test_layout_actions_settings_and_strings(self):
        assert layout_of(settings()) == {'x': 20, 'y': 140, 'alignX': 'left', 'alignY': 'top'}
        assert [action['id'] for action in page_actions(translator())] == ['refresh', 'site']
        assert SETTINGS == ('hangar_ratings',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])
        for key in SCHEMA.defaults:
            assert 'hangar_ratings_' + key in STRINGS['ru'], key


if __name__ == '__main__':
    unittest.main()
