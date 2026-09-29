# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import time
import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.core.storage import MemoryFile
from otmetki.features.arty_meter.i18n import STRINGS
from otmetki.features.arty_meter.model import ArtyBattle, ArtyBook, clean_entry, is_artillery
from otmetki.features.arty_meter.model.page import build_page, page_actions
from otmetki.features.arty_meter.model.preview import preview_text, preview_widget
from otmetki.features.arty_meter.model.widget import arty_widget
from otmetki.features.arty_meter.settings import SCHEMA, SETTINGS


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def battle():
    fire = ArtyBattle(u'Прохоровка', u'ИС-7')
    fire.add('hits')
    fire.add('splash', 2)
    fire.add('damage', 540)
    fire.add('modules', 2)
    fire.add('stuns')
    return fire


class ArtyBattleTest(unittest.TestCase):

    def test_counts_only_what_the_own_vehicle_took(self):
        fire = battle()
        assert fire.values() == {'hits': 1, 'splash': 2, 'damage': 540, 'modules': 2, 'stuns': 1, 'total': 3}
        assert not fire.add('damage', 0) and not fire.add('damage', 'x') and not fire.add('tracers')
        assert is_artillery('SPG') and not is_artillery('AT-SPG')

    def test_a_stun_counts_once_until_its_end_time_moves(self):
        fire = ArtyBattle()
        assert fire.stun(130.0, 12.0)
        assert not fire.stun(130.0, 11.0)
        assert not fire.stun(0.0, 0.0)
        assert fire.stun(150.0, 9.0)
        assert fire.stun(170.0, 14.0)
        assert not fire.stun(None, None) and not fire.stun(180.0, 0.0)
        assert fire.values()['stuns'] == 3


class ArtyBookTest(unittest.TestCase):

    def test_battles_and_the_day_total(self):
        store = MemoryFile()
        book = ArtyBook(store, 3)
        now = time.time()
        for _ in range(4):
            book.record(battle(), int(now))
        book.record(battle(), int(now - 3 * 86400))
        book.save()
        again = ArtyBook(store, 3)
        assert len(again.battles) == 3
        day = again.day(now)
        assert day['battles'] == 2 and day['hits'] == 2 and day['damage'] == 1080
        assert again.recent(1)[0]['map'] == u'Прохоровка'
        assert again.clear() and not again.clear()

    def test_damaged_file_is_cleaned(self):
        store = MemoryFile({'battles': [{'t': 'x'}, {'t': 5, 'hits': -3, 'map': 7}, 'junk']})
        book = ArtyBook(store, 10)
        assert book.battles == [{'t': 5, 'map': u'', 'tank': u'', 'hits': 0, 'splash': 0, 'damage': 0, 'modules': 0, 'stuns': 0}]
        assert clean_entry(None) is None


class ArtyViewTest(unittest.TestCase):

    def test_widget_thermometer(self):
        data = arty_widget(battle().values(), {'battles': 3, 'hits': 4, 'splash': 5, 'damage': 900}, Settings({}, SCHEMA))['data']
        assert data['battle']['total'] == 3 and data['scale'] == 10 and data['day'] == {'battles': 3, 'total': 9, 'damage': 900}
        assert arty_widget(battle().values(), None, Settings({'show_day': False}, SCHEMA))['data']['day'] is None

    def test_page_lists_today_and_the_battles(self):
        book = ArtyBook(MemoryFile(), 10)
        book.record(battle(), int(time.time()))
        page = build_page(book, time.time(), translator(), 10)
        assert [row['id'] for row in page['rows']][0] == 'today'
        assert page['rows'][1]['title'] == u'Прохоровка · ИС-7' and page['rows'][1]['badge'] == '3'
        assert build_page(ArtyBook(MemoryFile(), 10), time.time(), translator(), 10)['rows'] == []
        assert page_actions(translator('en'))[0]['id'] == 'clear'

    def test_preview_and_strings(self):
        assert u'накрытий 3' in preview_text(Settings({}, SCHEMA), translator())
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])
        assert SETTINGS == ('battle_arty_meter',)
        assert _support.widget_fixture('arty_meter', preview_widget(Settings({}, SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
