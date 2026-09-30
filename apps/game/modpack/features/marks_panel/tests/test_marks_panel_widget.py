# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.moe import ThresholdCurve
from otmetki.core.settings import Settings
from otmetki.features.marks_panel.i18n import STRINGS
from otmetki.features.marks_panel.model import PanelView, panel_state
from otmetki.features.marks_panel.model.constants import PREVIEW_THRESHOLDS
from otmetki.features.marks_panel.model.preview import preview_state, preview_widget
from otmetki.features.marks_panel.model.widget import marks_widget
from otmetki.features.marks_panel.settings import SCHEMA


def translator():
    return _support.translator(STRINGS, 'ru')


def preview_curve():
    return ThresholdCurve.from_api(PREVIEW_THRESHOLDS)


def unrated_widget(curve):
    settings = Settings({}, SCHEMA)
    state = panel_state({'moving_avg_damage': 2540, 'damage_rating': 0}, 100, curve, None, settings)
    return marks_widget(state, PanelView(settings), translator())['data']


def alt_widget(held):
    view = PanelView(Settings({'alt_detail': True, 'show_targets': False}, SCHEMA), held)
    return marks_widget(preview_state(view), view, translator())['data']


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

    def test_next_whole_percent(self):
        data = preview_widget(Settings({}, SCHEMA), translator())['data']

        assert data['up'] == {'level': 87, 'need': 2107}

    def test_next_whole_percent_switched_off(self):
        data = preview_widget(Settings({'show_up': False}, SCHEMA), translator())['data']

        assert data['up'] is None

    def test_verified_badge(self):
        data = preview_widget(Settings({}, SCHEMA), translator())['data']

        assert data['source'] == {'kind': 'verified', 'label': u'проверено'}

    def test_estimated_badge_without_the_dossier_rating(self):
        data = unrated_widget(preview_curve())

        assert data['source'] == {'kind': 'estimated', 'label': u'оценка'}

    def test_no_badge_without_a_rating_and_a_curve(self):
        data = unrated_widget(None)

        assert data['source'] is None

    def test_alt_mode_rests_compact_without_the_detail(self):
        data = alt_widget(held=False)

        assert data['style'] == 'compact'
        assert data['thresholds'] == []
        assert data['detail'] is None

    def test_alt_held_shows_the_thresholds_and_the_detail(self):
        data = alt_widget(held=True)

        assert data['style'] == 'extended'
        assert [item['level'] for item in data['thresholds']] == [65, 85, 95]
        assert data['detail'] == {
            'label': u'среднее',
            'ema': 2540,
            'ema_projected': 2551,
            'level': 95,
            'target': 3050,
        }

    def test_fixture_for_the_page(self):
        view = PanelView(Settings({'alt_detail': True}, SCHEMA), held=True)

        payload = marks_widget(preview_state(view), view, translator())

        assert _support.widget_fixture('marks_panel', payload)


if __name__ == '__main__':
    unittest.main()
