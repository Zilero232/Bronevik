# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.personal_best.i18n import STRINGS
from otmetki.features.personal_best.model import LiveBattle
from otmetki.features.personal_best.model.preview import preview_widget
from otmetki.features.personal_best.model.widget import line_widget
from otmetki.features.personal_best.settings import SCHEMA


def translator(language='en'):
    return _support.translator(STRINGS, language)


def settings_with(**values):
    return Settings(values, SCHEMA)


def live(**values):
    battle = LiveBattle()
    for metric, value in values.items():
        battle.add(metric, value)
    return battle


def rows_of(record, battle, **settings):
    return line_widget(record, battle, settings_with(**settings), translator())['data']['rows']


class LineWidgetTest(unittest.TestCase):

    def test_a_record_ahead_shows_the_record_and_what_is_left(self):
        row = rows_of({'damage': 6812}, live(damage=5612))[0]

        assert row['value'] == '6 812'
        assert row['note'] == '1 200 to go'

    def test_the_progress_is_the_share_of_the_record(self):
        row = rows_of({'damage': 4000}, live(damage=1000))[0]

        assert row['progress'] == 0.25

    def test_a_beaten_record_shows_the_current_value_and_the_margin(self):
        row = rows_of({'damage': 6812}, live(damage=7050))[0]

        assert row['value'] == '7 050'
        assert row['note'] == '+238'

    def test_a_beaten_record_fills_the_bar(self):
        row = rows_of({'damage': 6812}, live(damage=7050))[0]

        assert row['progress'] == 1.0

    def test_a_beaten_record_carries_the_honors_status(self):
        row = rows_of({'damage': 6812}, live(damage=7050))[0]

        assert row['status'] == 'honors'

    def test_only_switched_on_metrics_with_a_record_get_a_row(self):
        rows = rows_of({'damage': 6812, 'frags': 6}, live(), show_frags=True, show_assist=True)

        assert [row['text'] for row in rows] == ['damage', 'frags']

    def test_no_known_record_draws_no_card(self):
        payload = line_widget({}, live(damage=100), settings_with(), translator())

        assert payload is None

    def test_a_template_draws_no_card(self):
        payload = line_widget({'damage': 6812}, live(), settings_with(template='{metric}'), translator())

        assert payload is None

    def test_the_preview_is_a_card(self):
        payload = preview_widget(settings_with(), translator())

        assert payload['kind'] == 'card'


if __name__ == '__main__':
    unittest.main()
