# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import unittest

import _support
from otmetki.companion.binding import Credentials
from otmetki.companion.config import Config
from otmetki.core.errors import ReasonError
from otmetki.features.session_stats.i18n import STRINGS
from otmetki.features.session_stats.model.share import channels_of, preference_body, preference_of, preference_outcome, send_body, send_failure_key
from otmetki.features.session_stats.settings import SETTINGS

CREDENTIALS = Credentials('dev_share', 's' * 40, 12345678)
SESSION_ID = '5f0c8d6a9e3b4c2d8a1f7e6b5c4d3a2b'


class SessionShareTest(unittest.TestCase):

    def test_is_opt_in_and_off_by_default(self):
        config = Config()
        assert preference_of(config) == (False, 'telegram')
        config.update({'share_session_report': True, 'share_session_channel': 'both'})
        assert preference_of(config) == (True, 'both')
        assert Config({'share_session_channel': 'email'}).get('share_session_channel') == 'telegram'
        assert SETTINGS == ('hangar_session_panel', 'session_idle_minutes', 'share_session_report', 'share_session_channel')

    def test_channels(self):
        assert channels_of('both') == ['telegram', 'discord']
        assert channels_of('discord') == ['discord']
        assert channels_of('nonsense') == ['telegram']

    def test_bodies_match_the_contract(self):
        preference = preference_body(CREDENTIALS, True, 'discord')
        send = send_body(CREDENTIALS, SESSION_ID, 'both')
        assert preference == {'device_id': 'dev_share', 'account_id': 12345678, 'enabled': True, 'channels': ['discord']}
        assert send['session_id'] == SESSION_ID and send['channels'] == ['telegram', 'discord']
        with self.assertRaises(ReasonError):
            preference_body(None, True, 'telegram')
        for definition, body in (('preference', preference), ('sendRequest', send)):
            validator = _support.schema_validator('session-share.schema.json', definition)
            if validator is None:
                self.skipTest('jsonschema not installed')
            validator.validate(body)
        answer = _support.load_json(os.path.join(_support.CONTRACT_DIR, 'examples', 'session-share.example.json'))
        _support.schema_validator('session-share.schema.json', 'preferenceAnswer').validate(answer)

    def test_send_failures_get_their_own_notice(self):
        assert send_failure_key(404) == 'session_share_not_found'
        assert send_failure_key(409) == 'session_share_not_linked'
        assert send_failure_key(500) == 'session_share_failed'
        for key in ('session_share_not_found', 'session_share_not_linked', 'session_share_failed'):
            assert key in STRINGS['ru'] and key in STRINGS['en']
        validator = _support.schema_validator('session-share.schema.json', 'error')
        if validator is None:
            self.skipTest('jsonschema not installed')
        for code in ('session_not_found', 'channel_not_linked'):
            validator.validate({'error': code, 'message': 'x'})

    def test_a_channel_not_linked_stops_the_sync_until_the_switch_changes(self):
        assert preference_outcome(200) == 'synced'
        assert preference_outcome(409) == 'refused'
        for status in (0, 401, 429, 500):
            assert preference_outcome(status) == 'retry'

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
