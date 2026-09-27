# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.i18n import Catalog, Translator
from otmetki.core.settings import Settings
from otmetki.features.damage_log.i18n import STRINGS
from otmetki.features.damage_log.model import DamageLog, format_damage_log
from otmetki.features.damage_log.settings import SCHEMA, SETTINGS, SWITCH


def translator(language='ru'):
    return Translator(Catalog(STRINGS), language)


def filled_log():
    log = DamageLog()
    log.add('damage', 390, 'Pz. IV', 'ap')
    log.add('damage', 410.6, 'Tiger', 'heat')
    log.add('radio', 120, 'Pz. IV')
    log.add('track', 80)
    log.add('stun', 40)
    log.add('blocked', 240, 'Tiger', 'ap')
    log.add('received', 310, 'Tiger', 'he')
    return log


class DamageLogTest(unittest.TestCase):

    def test_totals(self):
        values = filled_log().values()
        assert values['dealt'] == 800
        assert values['assisted'] == 240
        assert (values['assist_radio'], values['assist_track'], values['assist_stun']) == (120, 80, 40)
        assert values['blocked'] == 240
        assert values['received'] == 310
        assert (values['hits'], values['blocked_hits'], values['received_hits']) == (2, 1, 1)

    def test_rejects_bad_events(self):
        log = DamageLog()
        assert not log.add('unknown', 10)
        assert not log.add('damage', 0)
        assert not log.add('damage', 'x')
        assert log.add('damage', 5, shell='weird')
        assert log.entries[0]['shell'] is None

    def test_summary_raises_totals(self):
        log = filled_log()
        assert log.apply_summary(damage=2150, assist=950, blocked=100, stun=None)
        assert not log.apply_summary(damage=2150, assist=950, blocked=100)
        values = log.values()
        assert values['dealt'] == 2150
        assert values['assisted'] == 950 + 40
        assert values['blocked'] == 240

    def test_recent_is_newest_first_and_filtered(self):
        log = filled_log()
        assert [entry['kind'] for entry in log.recent(3)] == ['received', 'blocked', 'stun']
        assert [entry['kind'] for entry in log.recent(5, ('received',))] == ['received']
        assert log.recent(0) == []

    def test_entries_are_capped(self):
        log = DamageLog()
        for index in range(80):
            log.add('damage', index + 1)
        assert len(log.entries) == 50
        assert log.values()['dealt'] == sum(range(1, 81))


class FormatTest(unittest.TestCase):

    def test_styles(self):
        log = filled_log()
        text = format_damage_log(log, Settings({}, SCHEMA), translator())
        lines = text.split('\n')
        assert 'Урон 800' in lines[0]
        assert 'Получено 310' in lines[0]
        assert len(lines) == 6
        assert 'Получено 310 Tiger ОФ' in lines[1]
        compact = format_damage_log(log, Settings({'style': 'compact', 'show_log': False}, SCHEMA), translator('en'))
        assert '800 / 240 / 240 / 310' in compact
        assert '\n' not in compact

    def test_custom_templates(self):
        settings = Settings({'style': 'custom', 'template': 'D={dealt} R={received_hits}', 'log_kinds': 'dealt', 'log_lines': 1,
                             'entry_template': '#{index} {amount} {vehicle}'}, SCHEMA)
        text = format_damage_log(filled_log(), settings, translator('en'))
        assert 'D=800 R=1' in text
        assert '#1 240 Tiger' in text


class SettingsTest(unittest.TestCase):

    def test_switch_and_schema(self):
        assert SETTINGS == (SWITCH,)
        settings = Settings({'style': 'fancy', 'log_lines': 100, 'template': 'x' * 900}, SCHEMA)
        assert settings.get('style') == 'full'
        assert settings.get('log_lines') == 15
        assert len(settings.get('template')) == 600

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
