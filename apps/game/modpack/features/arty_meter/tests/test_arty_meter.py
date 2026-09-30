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

DAY_S = 86400
DAY_TOTALS = {'battles': 3, 'hits': 4, 'splash': 5, 'damage': 900}


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


def stunned_once():
    fire = ArtyBattle()
    fire.stun(130.0, 12.0)
    return fire


def saved_and_reloaded_book():
    store = MemoryFile()
    book = ArtyBook(store, 3)
    now = int(time.time())
    for _ in range(4):
        book.record(battle(), now)
    book.record(battle(), now - 3 * DAY_S)
    book.save()
    return ArtyBook(store, 3)


def book_with_one_battle_today():
    book = ArtyBook(MemoryFile(), 10)
    book.record(battle(), int(time.time()))
    return book


class ArtyBattleTest(unittest.TestCase):

    def test_counts_what_the_own_vehicle_took(self):
        fire = battle()

        assert fire.values() == {'hits': 1, 'splash': 2, 'damage': 540, 'modules': 2, 'stuns': 1, 'total': 3}

    def test_zero_damage_is_not_counted(self):
        assert battle().add('damage', 0) is False

    def test_a_non_number_is_not_counted(self):
        assert battle().add('damage', 'x') is False

    def test_an_unknown_counter_is_not_counted(self):
        assert battle().add('tracers') is False

    def test_an_spg_is_artillery(self):
        assert is_artillery('SPG') is True

    def test_a_tank_destroyer_is_not_artillery(self):
        assert is_artillery('AT-SPG') is False


class StunTest(unittest.TestCase):

    def test_a_new_stun_counts(self):
        assert ArtyBattle().stun(130.0, 12.0) is True

    def test_the_same_end_time_counts_once(self):
        assert stunned_once().stun(130.0, 11.0) is False

    def test_a_moved_end_time_is_a_new_stun(self):
        assert stunned_once().stun(150.0, 9.0) is True

    def test_the_end_of_a_stun_is_not_counted(self):
        fire = stunned_once()

        assert fire.stun(180.0, 0.0) is False
        assert fire.stun(0.0, 0.0) is False

    def test_a_missing_stun_is_not_counted(self):
        assert stunned_once().stun(None, None) is False

    def test_every_new_stun_adds_one(self):
        fire = stunned_once()
        fire.stun(150.0, 9.0)
        fire.stun(170.0, 14.0)

        assert fire.values()['stuns'] == 3


class ArtyBookTest(unittest.TestCase):

    def test_the_book_keeps_the_last_battles(self):
        book = saved_and_reloaded_book()

        assert len(book.battles) == 3
        assert book.recent(1)[0]['map'] == u'Прохоровка'

    def test_the_day_total_counts_only_todays_battles(self):
        day = saved_and_reloaded_book().day(time.time())

        assert day['battles'] == 2
        assert day['hits'] == 2
        assert day['damage'] == 1080

    def test_clear_empties_the_book(self):
        book = saved_and_reloaded_book()

        assert book.clear() is True
        assert book.battles == []

    def test_clear_of_an_empty_book_changes_nothing(self):
        book = ArtyBook(MemoryFile(), 10)

        assert book.clear() is False

    def test_a_damaged_file_is_cleaned(self):
        store = MemoryFile({'battles': [{'t': 'x'}, {'t': 5, 'hits': -3, 'map': 7}, 'junk']})

        book = ArtyBook(store, 10)

        assert book.battles == [
            {'t': 5, 'map': u'', 'tank': u'', 'hits': 0, 'splash': 0, 'damage': 0, 'modules': 0, 'stuns': 0},
        ]

    def test_no_entry_is_none(self):
        assert clean_entry(None) is None


class ArtyWidgetTest(unittest.TestCase):

    def test_the_thermometer_shows_the_battle_total_on_its_scale(self):
        data = arty_widget(battle().values(), DAY_TOTALS, Settings({}, SCHEMA))['data']

        assert data['battle']['total'] == 3
        assert data['scale'] == 10

    def test_the_day_line(self):
        data = arty_widget(battle().values(), DAY_TOTALS, Settings({}, SCHEMA))['data']

        assert data['day'] == {'battles': 3, 'total': 9, 'damage': 900}

    def test_the_day_line_switched_off(self):
        data = arty_widget(battle().values(), None, Settings({'show_day': False}, SCHEMA))['data']

        assert data['day'] is None


class ArtyPageTest(unittest.TestCase):

    def test_today_comes_first(self):
        page = build_page(book_with_one_battle_today(), time.time(), translator(), 10)

        assert page['rows'][0]['id'] == 'today'

    def test_a_battle_row_names_the_map_and_the_tank(self):
        page = build_page(book_with_one_battle_today(), time.time(), translator(), 10)

        assert page['rows'][1]['title'] == u'Прохоровка · ИС-7'
        assert page['rows'][1]['badge'] == '3'

    def test_an_empty_book_has_no_rows(self):
        page = build_page(ArtyBook(MemoryFile(), 10), time.time(), translator(), 10)

        assert page['rows'] == []

    def test_the_page_offers_to_clear(self):
        assert page_actions(translator('en'))[0]['id'] == 'clear'


class SettingsTest(unittest.TestCase):

    def test_preview_text(self):
        assert u'накрытий 3' in preview_text(Settings({}, SCHEMA), translator())

    def test_strings_in_both_languages(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_settings_switch(self):
        assert SETTINGS == ('battle_arty_meter',)

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('arty_meter', preview_widget(Settings({}, SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
