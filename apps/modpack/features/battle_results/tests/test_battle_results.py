# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.companion.payload import build_battle_event
from otmetki.core.i18n import Catalog, Translator
from otmetki.core.settings import Settings
from otmetki.features.battle_results.i18n import STRINGS
from otmetki.features.battle_results.model import build_summary, counts, format_summary, signed
from otmetki.features.battle_results.settings import SCHEMA

BEFORE = {'tank_id': 1, 'damage_rating': 8600, 'moving_avg_damage': 2550, 'marks_on_gun': 1}


def translator(language='ru'):
    return Translator(Catalog(STRINGS), language)


def event():
    return build_battle_event(_support.battle_results(), {'vehicle_name': 'T-34', 'vehicle_tier': 5, 'map_name': '02_malinovka'})


class SummaryTest(unittest.TestCase):

    def test_build(self):
        summary = build_summary(event(), BEFORE, 'Малиновка')
        assert summary['result'] == 'win'
        assert summary['map'] == 'Малиновка'
        assert (summary['xp'], summary['credits'], summary['damage']) == (1150, 48000, 2150)
        assert (summary['assist'], summary['blocked'], summary['frags'], summary['spotted']) == (950, 900, 2, 3)
        assert summary['moe_percent'] == 87.12
        assert summary['moe_delta'] == 1.12
        assert summary['moving_avg_delta'] == 60
        assert summary['marks_delta'] == 1

    def test_without_history(self):
        summary = build_summary(event())
        assert summary['map'] == '02_malinovka'
        assert summary['moe_delta'] is None
        assert summary['moving_avg_delta'] is None
        empty = build_summary({'result': 'loss'})
        assert empty['moe_percent'] is None
        assert empty['damage'] == 0

    def test_bonus_filter(self):
        summary = build_summary(event())
        assert counts(summary, 'random')
        summary['bonus_type'] = 7
        assert not counts(summary, 'random')
        assert counts(summary, 'all')

    def test_signed(self):
        assert signed(1.5, True) == '+1.50%'
        assert signed(-60) == '-60'
        assert signed(0) == '0'
        assert signed(None) == ''


class FormatTest(unittest.TestCase):

    def test_text(self):
        text = format_summary(build_summary(event(), BEFORE, 'Малиновка'), Settings({}, SCHEMA), translator())
        lines = text.split('\n')
        assert 'победа — T-34, Малиновка' in lines[0]
        assert lines[1] == 'Опыт 1 150, кредиты 48 000'
        assert 'Урон 2 150, помощь 950' in lines[2]
        assert 'Отметка 87.12%, отметок 2' in lines[3]
        assert '+1.12%' in lines[3]
        assert '+60' in lines[3]

    def test_plain_and_sections(self):
        settings = Settings({'colored': False, 'show_economy': False, 'show_combat': False}, SCHEMA)
        text = format_summary(build_summary(event(), BEFORE), settings, translator('en'))
        assert '<font' not in text
        assert text.split('\n')[1] == 'MoE 87.12%, marks 2 (+1.12%), average damage +60'

    def test_custom_template(self):
        settings = Settings({'template': '{result}: {damage} ({moe_percent} {moe_delta})'}, SCHEMA)
        text = format_summary(build_summary(event(), BEFORE), settings, translator('en'))
        assert text == 'victory: 2 150 (87.12% +1.12%)'

    def test_strings_in_sync(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
