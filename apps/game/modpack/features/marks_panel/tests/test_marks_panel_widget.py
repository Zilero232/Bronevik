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


def widget_data(values):
    settings = Settings(values, SCHEMA)
    return marks_widget(preview_state(settings), settings, translator())['data']


def curveless_widget():
    settings = Settings({}, SCHEMA)
    snapshot = {'moving_avg_damage': 2000, 'damage_rating': 5000}
    state = panel_state(snapshot, 100, None, None, settings)
    return marks_widget(state, settings, translator())['data']


def unrated_widget(curve):
    settings = Settings({}, SCHEMA)
    state = panel_state({'moving_avg_damage': 2540, 'damage_rating': 0}, 100, curve, None, settings)
    return marks_widget(state, PanelView(settings), translator())['data']


def alt_widget(held):
    view = PanelView(Settings({'alt_detail': True, 'show_targets': False}, SCHEMA), held)
    return marks_widget(preview_state(view), view, translator())['data']


class MarksWidgetTest(unittest.TestCase):

    def test_extended_shows_the_projected_percent_and_the_mark(self):
        data = widget_data({'style': 'extended'})

        assert data['has_curve'] is True
        assert data['percent'] == 86.3
        assert data['delta'] == 0.18
        assert data['marks'] == 2
        assert data['mark'] == 'img://gui/maps/icons/library/marksOnGun/mark_2.png|otmetki:target'
        assert data['color'] == '#7CD35B'

    def test_extended_lists_the_thresholds_up_to_the_next_mark(self):
        data = widget_data({'style': 'extended'})

        assert data['thresholds'] == [
            {'level': 65, 'need': 0, 'reached': True},
            {'level': 85, 'need': 0, 'reached': True},
            {'level': 95, 'need': 25195, 'reached': False},
        ]

    def test_extended_shows_the_step_and_the_battles_to_the_next_mark(self):
        data = widget_data({'style': 'extended'})

        assert data['step'] == {'step': 0.5, 'need': 955}
        assert data['battles'] == {'level': 95, 'count': 45}

    def test_switches_hide_the_thresholds_the_step_and_the_battles(self):
        data = widget_data({'show_targets': False, 'show_step': False, 'show_battles': False})

        assert data['thresholds'] == []
        assert data['step'] is None
        assert data['battles'] is None

    def test_custom_template_renders_in_the_extended_frame(self):
        data = widget_data({'style': 'custom', 'template': '{percent}'})

        assert data['style'] == 'extended'
        assert data['text'] == u'86.12'

    def test_without_a_curve_shows_the_dossier_percent_only(self):
        data = curveless_widget()

        assert data['has_curve'] is False
        assert data['percent'] == 50.0
        assert data['mark'] is None

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
