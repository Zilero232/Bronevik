# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.format import MARK_COLORS, strip_tags
from otmetki.core.moe import ThresholdCurve
from otmetki.core.settings import Settings
from otmetki.features.hangar_marks.i18n import STRINGS
from otmetki.features.hangar_marks.model import format_panel, hangar_state
from otmetki.features.hangar_marks.model.preview import preview_text, preview_widget
from otmetki.features.hangar_marks.settings import GROUP, SCHEMA, SETTINGS, SWITCH

CURVE = {'thresholds': {'65': 2000, '85': 2600, '95': 3100}}
SNAPSHOT = {'tank_id': 1, 'moving_avg_damage': 2500, 'damage_rating': 8150, 'marks_on_gun': 1}


def translator(language='en'):
    return _support.translator(STRINGS, language)


def render(pace=3000, curve=True, **values):
    thresholds = ThresholdCurve.from_api(CURVE) if curve else None
    state = hangar_state(SNAPSHOT, thresholds, pace)
    return format_panel(state, Settings(values, SCHEMA), translator())


def plain_lines(**values):
    return strip_tags(render(**values)).split('\n')


def preview_card():
    return preview_widget(Settings({}, SCHEMA), translator())['data']


class ExtendedPanelTest(unittest.TestCase):

    def test_head_line_shows_the_percent_and_the_marks(self):
        assert plain_lines()[0] == u'MoE 81.50% ★'

    def test_average_line_shows_the_average_and_the_pace(self):
        assert plain_lines()[1].startswith('average 2 500 · pace 3 000')

    def test_target_line_shows_reached_and_remaining_levels(self):
        line = plain_lines()[2]

        assert u'65%: ✓' in line
        assert '95%: ' in line

    def test_forecast_line_counts_the_battles_to_the_next_level(self):
        assert plain_lines()[3] == 'to 85% (average 2 600): ~12 battles'

    def test_the_head_takes_the_colour_of_the_marks(self):
        assert MARK_COLORS[1] in render()


class ForecastTest(unittest.TestCase):

    def test_without_a_pace_the_forecast_is_unknown(self):
        assert strip_tags(render(pace=None)).endswith('~-')

    def test_a_pace_below_the_next_level_never_reaches_it(self):
        assert strip_tags(render(pace=2400)).endswith(u'~∞')

    def test_without_a_curve_the_panel_says_so_and_shows_no_targets(self):
        text = strip_tags(render(curve=False))

        assert 'no thresholds' in text
        assert '95%' not in text


class StyleTest(unittest.TestCase):

    def test_compact_style_is_one_line(self):
        assert '\n' not in strip_tags(render(style='compact'))

    def test_custom_style_renders_the_template(self):
        assert strip_tags(render(style='custom', template='{percent}|{need85}')) == '81.50|7 550'

    def test_targets_and_forecast_switch_off(self):
        text = strip_tags(render(show_targets=False, show_forecast=False))

        assert text.count('\n') == 1

    def test_colour_mode_off_uses_the_neutral_colour(self):
        head = render(color_mode='off').split('\n')[0]

        assert 'color="#F2EAD3"' in head


class PreviewTest(unittest.TestCase):

    def test_preview_text_shows_the_sample_percent(self):
        assert 'MoE 86.12%' in strip_tags(preview_text(Settings({}, SCHEMA), translator()))

    def test_preview_card_carries_the_percent_and_the_chips(self):
        card = preview_card()

        assert card['value'] == '86.12%'
        assert [chip['value'] for chip in card['chips']] == ['2 540', '3 400']

    def test_preview_card_marks_reached_levels_done(self):
        rows = preview_card()['rows']

        assert [row['status'] for row in rows[:3]] == ['done', 'done', 'active']
        assert rows[2]['value'] == '28 295'
        assert rows[2]['note'] == 'per battle'

    def test_preview_card_ends_with_the_forecast(self):
        forecast = preview_card()['rows'][3]

        assert forecast['text'] == 'to 95%'
        assert forecast['value'] == '~45 battles'


class DescriptorTest(unittest.TestCase):

    def test_both_languages_have_the_same_keys(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])

    def test_the_config_switch(self):
        assert SETTINGS == (SWITCH,)

    def test_the_settings_group(self):
        assert GROUP == 'hangar'


if __name__ == '__main__':
    unittest.main()
