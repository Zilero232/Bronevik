# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.hangar_space.i18n import STRINGS
from otmetki.features.hangar_space.model import (
    build_page,
    normalize_space,
    override_changes,
    space_name,
    space_names,
    space_path,
)
from otmetki.features.hangar_space.settings import SCHEMA, SETTINGS

OURS = 'spaces/h30_newyear_2025'
EVENT = 'spaces/h40_event'


def translator():
    return _support.translator(STRINGS, 'ru')


class NamesTest(unittest.TestCase):

    def test_a_space_name_is_its_folder_in_lower_case(self):
        assert space_name('Spaces/H08_MT_Hangar') == 'h08_mt_hangar'

    def test_paths_outside_the_spaces_folder_are_not_spaces(self):
        assert space_names(['DEFAULT', 'spaces/', 'spaces/a b', None, 'spaces/b', 'spaces/a', 'spaces/a']) == ['a', 'b']

    def test_a_name_becomes_its_path(self):
        assert space_path('h08_mt_hangar') == 'spaces/h08_mt_hangar'
        assert space_path(u'') is None


class SettingsTest(unittest.TestCase):

    def test_an_empty_choice_keeps_the_game_hangar(self):
        assert Settings(None, SCHEMA).get('space') == u''

    def test_a_folder_name_is_kept_in_lower_case(self):
        assert Settings({'space': ' H08_MT_Hangar '}, SCHEMA).get('space') == 'h08_mt_hangar'

    def test_a_path_or_junk_is_refused(self):
        assert normalize_space('../spaces/x') is None
        assert Settings({'space': 'a/b'}, SCHEMA).get('space') == u''

    def test_the_component_switch_is_hangar_space(self):
        assert SETTINGS == ('hangar_space',)

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


class OverridesTest(unittest.TestCase):

    def test_the_choice_fills_both_empty_slots(self):
        assert override_changes({}, None, OURS) == {True: OURS, False: OURS}

    def test_an_event_hangar_of_the_server_stays(self):
        assert override_changes({True: EVENT, False: None}, None, OURS) == {False: OURS}

    def test_the_own_choice_is_replaced_or_dropped(self):
        assert override_changes({True: OURS, False: OURS}, OURS, None) == {True: None, False: None}

    def test_nothing_changes_when_the_choice_is_in_place(self):
        assert override_changes({True: OURS, False: OURS}, OURS, OURS) == {}


class PageTest(unittest.TestCase):

    def test_the_page_starts_with_the_game_hangar(self):
        rows = build_page(['a', 'b'], 'b', 'a', translator())['rows']

        assert [row['id'] for row in rows] == ['native', 'a', 'b']

    def test_the_chosen_space_has_no_choose_button(self):
        rows = build_page(['a', 'b'], 'b', 'a', translator())['rows']

        assert rows[2]['actions'] == []
        assert rows[1]['badge'] == u'Сейчас'


if __name__ == '__main__':
    unittest.main()
