# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.marks_panel.i18n import STRINGS
from otmetki.features.marks_panel.model import panel_state
from otmetki.features.marks_panel.model.preview import preview_state, preview_widget
from otmetki.features.marks_panel.model.widget import marks_widget
from otmetki.features.marks_panel.settings import SCHEMA


def translator():
    return _support.translator(STRINGS, 'ru')


class MarksWidgetTest(unittest.TestCase):

    def test_percent_delta_and_mark_icon(self):
        settings = Settings({'style': 'extended'}, SCHEMA)
        data = marks_widget(preview_state(settings), settings, translator())['data']
        assert data['has_curve'] and data['marks'] == 2
        assert data['mark'].startswith('img://gui/maps/icons/library/marksOnGun/mark_2.png')
        assert data['percent'] > 86 and data['delta'] > 0 and data['color'].startswith('#')
        assert [item['level'] for item in data['thresholds']] == [65, 85, 95]
        assert data['thresholds'][0] == {'level': 65, 'need': 0, 'reached': True}
        assert data['step']['need'] > 0 and data['battles']['level'] == 95

    def test_switches_and_custom_text(self):
        settings = Settings({'show_targets': False, 'show_step': False, 'show_battles': False, 'style': 'custom',
                             'template': '{percent}'}, SCHEMA)
        data = marks_widget(preview_state(settings), settings, translator())['data']
        assert data['thresholds'] == [] and data['step'] is None and data['battles'] is None
        assert data['style'] == 'extended' and data['text']

    def test_without_a_curve(self):
        settings = Settings({}, SCHEMA)
        data = marks_widget(panel_state({'moving_avg_damage': 2000, 'damage_rating': 5000}, 100, None, None, settings), settings,
                            translator())['data']
        assert data['has_curve'] is False and data['percent'] == 50.0 and data['mark'] is None

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('marks_panel', preview_widget(Settings({'style': 'extended'}, SCHEMA), translator()))


if __name__ == '__main__':
    unittest.main()
