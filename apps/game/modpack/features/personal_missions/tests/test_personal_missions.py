# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.personal_missions.i18n import STRINGS
from otmetki.features.personal_missions.model import (
    build_page,
    clean_missions,
    counts,
    format_battle,
    format_hangar,
    in_progress,
)
from otmetki.features.personal_missions.model.constants import MAX_MISSIONS, MAX_TEXT, PREVIEW_MISSIONS
from otmetki.features.personal_missions.model.preview import preview_text
from otmetki.features.personal_missions.settings import SCHEMA, SETTINGS

FINISHED_COUNT = MAX_MISSIONS + 20


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def settings(**values):
    return Settings(values, SCHEMA)


def missions():
    return clean_missions(PREVIEW_MISSIONS)[0]


def ids(items):
    return [mission['id'] for mission in items]


def raw_with_garbage():
    return list(PREVIEW_MISSIONS) + [
        {'id': 9, 'name': u'<b>X</b>  1', 'main': u'a' * 500, 'state': 'in_progress'},
        {'id': 10, 'name': u'Y', 'state': 'failed'},
        {'id': 11, 'name': u'', 'state': 'done'},
        'junk',
    ]


def many_finished_and_one_active():
    finished = [{'id': index, 'name': u'Done %d' % index, 'state': 'done'} for index in range(FINISHED_COUNT)]
    active = {'id': 'last', 'name': u'Active', 'state': 'in_progress'}
    return clean_missions(finished + [active])


def missions_with_tiers():
    raw = [
        {'id': 1, 'name': u'Альфа', 'state': 'in_progress', 'levels': [8, 4]},
        {'id': 2, 'name': u'Браво', 'state': 'in_progress', 'levels': (9, 10)},
        {'id': 3, 'name': u'Чарли', 'state': 'in_progress', 'levels': [None, 10]},
    ]
    return clean_missions(raw)[0]


class CleanTest(unittest.TestCase):

    def test_invalid_missions_are_dropped_and_the_active_ones_come_first(self):
        cleaned, _totals = clean_missions(raw_with_garbage())

        assert ids(cleaned) == [1, 2, 9, 3]

    def test_names_lose_their_tags_and_extra_spaces(self):
        cleaned, _totals = clean_missions(raw_with_garbage())

        assert cleaned[2]['name'] == u'X 1'

    def test_long_conditions_are_cut(self):
        cleaned, _totals = clean_missions(raw_with_garbage())

        assert len(cleaned[2]['main']) == MAX_TEXT

    def test_a_mission_without_classes_has_an_empty_list(self):
        cleaned, _totals = clean_missions(raw_with_garbage())

        assert cleaned[2]['classes'] == []

    def test_totals_count_the_valid_missions(self):
        _cleaned, totals = clean_missions(raw_with_garbage())

        assert totals == {'active': 3, 'done': 1, 'honors': 1}

    def test_levels_are_ordered_and_dropped_when_incomplete(self):
        cleaned = missions_with_tiers()

        assert [mission['levels'] for mission in cleaned] == [[4, 8], [9, 10], None]


class CapTest(unittest.TestCase):

    def test_the_cap_keeps_the_mission_in_progress(self):
        cleaned, _totals = many_finished_and_one_active()

        assert len(cleaned) == MAX_MISSIONS
        assert cleaned[0]['id'] == 'last'

    def test_the_totals_count_every_mission(self):
        _cleaned, totals = many_finished_and_one_active()

        assert totals == {'active': 1, 'done': 80, 'honors': 0}

    def test_the_hangar_title_shows_the_totals(self):
        cleaned, totals = many_finished_and_one_active()

        text = format_hangar(cleaned, settings(), translator('en'), totals)

        assert u'1 in progress, 80 done' in text
        assert u'Active' in text


class InProgressTest(unittest.TestCase):

    def test_every_class(self):
        assert ids(in_progress(missions())) == [1, 2]

    def test_one_class(self):
        assert ids(in_progress(missions(), 'heavyTank')) == [2]

    def test_a_class_without_missions(self):
        assert in_progress(missions(), 'SPG') == []

    def test_counts(self):
        assert counts(missions()) == {'active': 2, 'done': 1, 'honors': 1}

    def test_tier_six_fits_the_range_and_the_unbounded_mission(self):
        assert ids(in_progress(missions_with_tiers(), None, 6)) == [1, 3]

    def test_tier_ten_fits_the_range_and_the_unbounded_mission(self):
        assert ids(in_progress(missions_with_tiers(), None, 10)) == [2, 3]

    def test_no_tier_fits_every_mission(self):
        assert ids(in_progress(missions_with_tiers())) == [1, 2, 3]

    def test_the_battle_line_shows_only_the_missions_of_the_tier(self):
        text = format_battle(missions_with_tiers(), 'heavyTank', settings(), translator(), 9)

        assert u'Браво' in text
        assert u'Альфа' not in text


class HangarTextTest(unittest.TestCase):

    def test_title_and_conditions(self):
        text = format_hangar(missions(), settings(), translator())

        assert u'ЛБЗ: в работе 2, выполнено 1, с отличием 1' in text
        assert u'Основное: Нанести 3000 урона' in text
        assert u'С отличием: Не получить' in text

    def test_short_view_caps_the_missions_and_hides_the_conditions(self):
        text = format_hangar(missions(), settings(show_conditions=False, max_missions=1), translator('en'))

        assert u'СТ-7' in text
        assert u'ТТ-3' not in text
        assert 'Main:' not in text

    def test_no_mission_in_progress(self):
        done_only = [mission for mission in missions() if mission['state'] != 'in_progress']

        text = format_hangar(done_only, settings(), translator())

        assert u'Нет задач в работе' in text

    def test_no_missions_hides_the_label(self):
        assert format_hangar([], settings(), translator()) is None


class BattleTextTest(unittest.TestCase):

    def test_only_the_missions_of_the_class(self):
        text = format_battle(missions(), 'heavyTank', settings(), translator())

        assert u'ТТ-3. Прорыв' in text
        assert u'СТ-7' not in text

    def test_no_missions_of_the_class_hides_the_line(self):
        assert format_battle(missions(), 'SPG', settings(), translator()) is None


class PageTest(unittest.TestCase):

    def test_rows_in_state_order(self):
        page = build_page(missions(), translator())

        assert [row['id'] for row in page['rows']] == ['1', '2', '3']

    def test_a_mission_done_with_honours(self):
        row = build_page(missions(), translator())['rows'][2]

        assert row['subtitle'] == u'Выполнена с отличием'
        assert row['badge'] == u'✓✓'

    def test_a_mission_in_progress_has_no_badge(self):
        row = build_page(missions(), translator())['rows'][0]

        assert row['badge'] is None

    def test_the_main_condition_detail(self):
        row = build_page(missions(), translator())['rows'][0]

        assert row['details'][0] == {'label': u'Основное условие', 'value': u'Нанести 3000 урона'}

    def test_no_missions_no_rows(self):
        assert build_page([], translator())['rows'] == []


class SettingsTest(unittest.TestCase):

    def test_preview_shows_the_medium_tank_mission(self):
        assert u'СТ-7' in preview_text(settings(), translator())

    def test_settings_switch(self):
        assert SETTINGS == ('hangar_personal_missions',)

    def test_strings_in_both_languages(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
