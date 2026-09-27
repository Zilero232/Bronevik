# -*- coding: utf-8 -*-
import os
import shutil
import tempfile
import unittest

import _support  # noqa: F401
from otmetki.config import DEFAULT_SERVER_URL, FEATURES, OPT_IN_FEATURES, Config, is_valid_server_url
from otmetki.i18n import STRINGS, Translator, resolve_language
from otmetki.panels import format_moe_panel, format_number, format_session_panel, format_session_plain
from otmetki.settings_template import BIND_CODE_VAR, build_template, settings_to_config
from otmetki.storage import JsonFile


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

    def test_json_file_roundtrip(self):
        directory = tempfile.mkdtemp()
        try:
            path = os.path.join(directory, 'nested', 'config.json')
            storage = JsonFile(path, pretty=True)
            self.assertEqual(storage.read({}), {})
            storage.write({'a': u'Три отметки'})
            storage.write({'a': u'Три отметки', 'b': 2})
            self.assertEqual(JsonFile(path).read(), {'a': u'Три отметки', 'b': 2})
            with open(path, 'w') as handle:
                handle.write('{broken')
            self.assertEqual(JsonFile(path).read('fallback'), 'fallback')
        finally:
            shutil.rmtree(directory)


class SettingsTemplateTest(unittest.TestCase):

    def test_template_shape(self):
        config = Config({'send_moe_distribution': False})
        template = build_template(config, Translator('en'), 'status')
        self.assertEqual(template['modDisplayName'], 'Three Marks')
        self.assertEqual([c['varName'] for c in template['column1']], list(FEATURES))
        self.assertFalse([c for c in template['column1'] if c['varName'] == 'send_moe_distribution'][0]['value'])
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
        self.assertEqual(Translator('ru')('moe_need', level='85', damage='1 200'), u'до 85%: ещё 1 200')


class PanelsTest(unittest.TestCase):

    def test_number(self):
        self.assertEqual(format_number(1234567.4), u'1 234 567')
        self.assertEqual(format_number(None), u'-')

    def test_moe_panel(self):
        text = format_moe_panel({
            'current_percent': 81.5,
            'projected_percent': 83.12,
            'target_level': 85.0,
            'damage_remaining': 1234,
        }, Translator('en'))
        self.assertIn(u'MoE 81.50%', text)
        self.assertIn(u'83.12%', text)
        self.assertIn(u'to 85%: 1 234 more', text)
        text = format_moe_panel({'current_percent': 50.0, 'projected_percent': None}, Translator('en'))
        self.assertIn(u'no thresholds', text)

    def test_session_panel(self):
        summary = {'battles': 5, 'win_rate': 60.0, 'avg_damage': 2100.0, 'wn8': None}
        self.assertIn(u'60.00%', format_session_panel(summary, Translator('en')))
        self.assertEqual(format_session_plain(summary, Translator('en')), u'Session: Battles 5, Win rate 60.00%, Avg dmg 2 100, WN8 -')


if __name__ == '__main__':
    unittest.main()
