# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.main_gun.i18n import STRINGS
from otmetki.features.main_gun.model import format_panel, threshold, values
from otmetki.features.main_gun.model.preview import preview_text
from otmetki.features.main_gun.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


class MainGunTest(unittest.TestCase):

    def test_threshold_is_a_fifth_of_the_enemy_hp_and_at_least_1000(self):
        assert threshold(14700) == 2940
        assert threshold(14701) == 2941
        assert threshold(3000) == 1000
        assert threshold(None) == 1000

    def test_values(self):
        state = values(1850, 14700, 8580)
        assert state == {'damage': 1850, 'need': 2940, 'left': 1090, 'team': 6120, 'share': 30, 'reached': False}
        assert values(3100, 14700, 8580)['reached']
        assert values(900, 14700, 14700)['team'] == 900
        assert values(0, 0, 0)['share'] == 0

    def test_format(self):
        text = format_panel(values(1850, 14700, 8580), Settings({}, SCHEMA), translator())
        assert u'Основной калибр 1 850 / 2 940' in text and u'осталось 1 090' in text and u'ваша доля 30%' in text
        reached = format_panel(values(3100, 14700, 8580), Settings({'show_team': False}, SCHEMA), translator('en'))
        assert 'threshold 2 940 reached (3 100)' in reached and 'team damage' not in reached
        custom = format_panel(values(1850, 14700, 8580), Settings({'template': '{damage}|{need}|{share}'}, SCHEMA), translator())
        assert '1 850|2 940|30' in custom

    def test_preview_settings_and_strings(self):
        assert '1 090' in preview_text(Settings({}, SCHEMA), translator())
        assert SETTINGS == ('battle_main_gun',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
