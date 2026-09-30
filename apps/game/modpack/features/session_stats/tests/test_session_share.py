# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import unittest

import _support
from otmetki.companion.binding import Credentials
from otmetki.companion.config import Config
from otmetki.core.errors import ReasonError
from otmetki.features.session_stats.i18n import STRINGS
from otmetki.features.session_stats.model.share import (
    channels_of,
    preference_body,
    preference_of,
    preference_outcome,
    restore_synced,
    send_body,
    send_failure_key,
)
from otmetki.features.session_stats.settings import SETTINGS

CREDENTIALS = Credentials('dev_share', 's' * 40, 12345678)
SESSION_ID = '5f0c8d6a9e3b4c2d8a1f7e6b5c4d3a2b'
SHARE_SCHEMA = 'session-share.schema.json'
SEND_FAILURE_KEYS = ('session_share_not_found', 'session_share_not_linked', 'session_share_failed')


def contract_validator(test, definition):
    validator = _support.schema_validator(SHARE_SCHEMA, definition)
    if validator is None:
        test.skipTest('jsonschema not installed')
    return validator


def preference_answer_example():
    return _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'session-share.example.json'))


class PreferenceTest(unittest.TestCase):

    def test_is_off_by_default_on_telegram(self):
        assert preference_of(Config()) == (False, 'telegram')

    def test_follows_the_player_settings(self):
        config = Config()

        config.update({'share_session_report': True, 'share_session_channel': 'both'})

        assert preference_of(config) == (True, 'both')

    def test_an_unknown_channel_falls_back_to_telegram(self):
        config = Config({'share_session_channel': 'email'})

        assert config.get('share_session_channel') == 'telegram'

    def test_the_feature_reads_its_switches(self):
        assert SETTINGS == (
            'hangar_session_panel',
            'session_idle_minutes',
            'share_session_report',
            'share_session_channel',
        )


class ChannelsTest(unittest.TestCase):

    def test_both_is_telegram_and_discord(self):
        assert channels_of('both') == ['telegram', 'discord']

    def test_one_channel_is_itself(self):
        assert channels_of('discord') == ['discord']

    def test_an_unknown_channel_is_telegram(self):
        assert channels_of('nonsense') == ['telegram']


class BodiesTest(unittest.TestCase):

    def test_preference_body_carries_the_device_and_the_choice(self):
        body = preference_body(CREDENTIALS, True, 'discord')

        assert body == {'device_id': 'dev_share', 'account_id': 12345678, 'enabled': True, 'channels': ['discord']}

    def test_send_body_carries_the_session_and_the_channels(self):
        body = send_body(CREDENTIALS, SESSION_ID, 'both')

        assert body['session_id'] == SESSION_ID
        assert body['channels'] == ['telegram', 'discord']

    def test_an_unbound_mod_has_no_body(self):
        with self.assertRaises(ReasonError):
            preference_body(None, True, 'telegram')

    def test_preference_body_matches_the_contract(self):
        validator = contract_validator(self, 'preference')

        validator.validate(preference_body(CREDENTIALS, True, 'discord'))

    def test_send_body_matches_the_contract(self):
        validator = contract_validator(self, 'sendRequest')

        validator.validate(send_body(CREDENTIALS, SESSION_ID, 'both'))

    def test_the_answer_example_matches_the_contract(self):
        validator = contract_validator(self, 'preferenceAnswer')

        validator.validate(preference_answer_example())


class SendFailureTest(unittest.TestCase):

    def test_a_missing_session_gets_its_own_notice(self):
        assert send_failure_key(404) == 'session_share_not_found'

    def test_an_unlinked_channel_gets_its_own_notice(self):
        assert send_failure_key(409) == 'session_share_not_linked'

    def test_any_other_failure_gets_the_general_notice(self):
        assert send_failure_key(500) == 'session_share_failed'

    def test_every_notice_is_translated(self):
        for key in SEND_FAILURE_KEYS:
            assert key in STRINGS['ru']
            assert key in STRINGS['en']

    def test_the_contract_names_both_errors(self):
        validator = contract_validator(self, 'error')

        for code in ('session_not_found', 'channel_not_linked'):
            validator.validate({'error': code, 'message': 'x'})


class PreferenceOutcomeTest(unittest.TestCase):

    def test_ok_is_synced(self):
        assert preference_outcome(200) == 'synced'

    def test_a_channel_not_linked_stops_the_sync_until_the_switch_changes(self):
        assert preference_outcome(409) == 'refused'

    def test_anything_else_is_retried(self):
        for status in (0, 401, 429, 500):
            assert preference_outcome(status) == 'retry'


class RestoreSyncedTest(unittest.TestCase):

    def test_a_saved_pair_restores_as_a_tuple(self):
        assert restore_synced([True, 'discord']) == (True, 'discord')

    def test_anything_else_restores_as_nothing(self):
        for stored in (None, [True], 'telegram'):
            assert restore_synced(stored) is None


class StringsTest(unittest.TestCase):

    def test_strings_are_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
