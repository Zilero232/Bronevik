# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.companion.payload import build_battle_event
from otmetki.core.settings import Settings
from otmetki.features.battle_results.i18n import STRINGS
from otmetki.features.battle_results.model import build_page, build_summary, compact, counts, format_summary, page_actions, session_of, signed
from otmetki.features.battle_results.settings import SCHEMA

BEFORE = {'tank_id': 1, 'damage_rating': 8600, 'moving_avg_damage': 2550, 'marks_on_gun': 1}


def translator(language='ru'):
    return _support.translator(STRINGS, language)


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


class PageTest(unittest.TestCase):

    def entries(self):
        battle = event()
        battle['stats'].update({'repair_cost': 4200, 'ammo_cost': 1800, 'consumables_cost': 3000})
        first = compact(build_summary(battle, BEFORE, 'Малиновка'))
        second = dict(first, arena='2', time=first['time'] + 7200, result='loss', damage=300, moe_delta=-0.4)
        return [first, second]

    def test_extended_summary(self):
        battle = event()
        battle['stats'].update({'repair_cost': 4200, 'ammo_cost': 1800, 'consumables_cost': 3000, 'free_xp': 57})
        entry = compact(build_summary(battle, BEFORE, 'Малиновка'))
        assert entry['net_credits'] == 48000 - 4200 - 1800 - 3000
        assert (entry['shots'], entry['hits'], entry['pens'], entry['free_xp']) == (12, 9, 7, 57)
        assert 'players' not in entry and 'vehicles' not in entry

    def test_session_split_by_idle_gap(self):
        entries = self.entries()
        assert session_of(entries, 3600) == entries[1:]
        assert session_of(entries, 3 * 3600) == entries
        assert session_of([], 60) == []

    def test_page(self):
        page = build_page(self.entries(), translator(), 3600)
        rows = page['rows']
        assert [row['id'] for row in rows] == ['session', '2', event()['arena_unique_id']]
        assert rows[0]['title'] == 'Сессия: 1 боёв'
        assert rows[1]['badge'] == '-0.40%' and rows[1]['title'].startswith('поражение')
        details = dict((item['label'], item['value']) for item in rows[2]['details'])
        assert details['Кредиты за вычетом расходов'] == '39 000'
        assert details['Отметка'] == '87.12% (+1.12%)'
        assert build_page([], translator('en'), 3600)['rows'] == []
        assert [action['id'] for action in page_actions(translator())] == ['site', 'clear']

    def test_history_size_limits(self):
        assert Settings({'history_size': 1000}, SCHEMA).get('history_size') == 100


if __name__ == '__main__':
    unittest.main()
