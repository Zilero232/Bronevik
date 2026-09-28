# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.companion.config import DEFAULT_SERVER_URL, FEATURES, OPT_IN_FEATURES, Config, is_valid_server_url
from otmetki.companion.i18n import STRINGS, Translator, resolve_language
from otmetki.companion.settings_ui import BIND_CODE_VAR, build_template, settings_to_config


class ConfigTest(unittest.TestCase):

    def test_defaults(self):
        config = Config()
        self.assertEqual(config.server_url, DEFAULT_SERVER_URL)
        for feature in FEATURES:
            self.assertEqual(config.is_enabled(feature), feature not in OPT_IN_FEATURES)

    def test_update_validates_types(self):
        config = Config()
        changed = config.update({
            'enabled': 'yes',
            'send_queue_times': False,
            'flush_interval_seconds': 1,
            'session_idle_minutes': 30.7,
            'server_url': 'http://evil.example',
            'unknown': 1,
        })
        self.assertEqual(changed, ['flush_interval_seconds', 'send_queue_times', 'session_idle_minutes'])
        self.assertTrue(config.get('enabled'))
        self.assertEqual(config.get('flush_interval_seconds'), 5)
        self.assertEqual(config.get('session_idle_minutes'), 30)
        self.assertEqual(config.server_url, DEFAULT_SERVER_URL)
        self.assertFalse(config.is_enabled('send_queue_times'))

    def test_master_switch(self):
        config = Config({'enabled': False})
        self.assertFalse(config.is_enabled('send_battle_results'))

    def test_server_url(self):
        self.assertTrue(is_valid_server_url('https://api.example'))
        self.assertTrue(is_valid_server_url('http://localhost:4000'))
        self.assertFalse(is_valid_server_url('http://localhost.evil.com'))
        self.assertFalse(is_valid_server_url('ftp://x'))
        config = Config({'server_url': 'http://127.0.0.1:4000/'})
        self.assertEqual(config.endpoint('/mod/ingest'), 'http://127.0.0.1:4000/mod/ingest')


class SettingsTemplateTest(unittest.TestCase):

    def test_template_shape(self):
        config = Config({'send_queue_times': False})
        template = build_template(config, Translator('en'), 'status')
        self.assertEqual(template['modDisplayName'], 'Three Marks')
        self.assertEqual([c['varName'] for c in template['column1']], list(FEATURES))
        self.assertFalse([c for c in template['column1'] if c['varName'] == 'send_queue_times'][0]['value'])
        self.assertEqual(template['column2'][1]['type'], 'TextInput')
        self.assertEqual(template['column2'][1]['varName'], BIND_CODE_VAR)

    def test_settings_to_config(self):
        updates = settings_to_config({'enabled': False, 'send_queue_times': False, BIND_CODE_VAR: 'ABCDEF', 'x': 1})
        self.assertEqual(updates, {'enabled': False, 'send_queue_times': False})


class I18nTest(unittest.TestCase):

    def test_same_keys(self):
        self.assertEqual(sorted(STRINGS['ru'].keys()), sorted(STRINGS['en'].keys()))

    def test_language(self):
        self.assertEqual(resolve_language('en'), 'en')
        self.assertEqual(resolve_language('auto', 'ru'), 'ru')
        self.assertEqual(resolve_language('auto', 'EN'), 'en')
        self.assertEqual(resolve_language('auto', 'de'), 'ru')
        self.assertEqual(Translator('ru')('bind_failed', reason='x'), u'Три отметки: не удалось привязать (x)')
        self.assertEqual(Translator('de').language, 'ru')


if __name__ == '__main__':
    unittest.main()
