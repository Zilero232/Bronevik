# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math
import unittest

import _support
from otmetki.core.format import COLOR_DOWN, COLOR_NEUTRAL, COLOR_WARN
from otmetki.core.settings import Settings
from otmetki.features.gun_arc.i18n import STRINGS
from otmetki.features.gun_arc.model import arc_state, bar, format_panel, side_color
from otmetki.features.gun_arc.model.constants import BAR_CELLS
from otmetki.features.gun_arc.model.preview import preview_text
from otmetki.features.gun_arc.settings import SCHEMA, SETTINGS


LIMITS = (math.radians(-15), math.radians(15))


def translator(language='ru'):
    return _support.translator(STRINGS, language)


def panel_text(yaw_degrees, values=None, language='ru'):
    state = arc_state(math.radians(yaw_degrees), LIMITS)
    return format_panel(state, Settings(values or {}, SCHEMA), translator(language))


class ArcTest(unittest.TestCase):

    def test_degrees_left_to_the_left_limit(self):
        state = arc_state(math.radians(5), LIMITS)

        assert round(state['left']) == 20

    def test_degrees_left_to_the_right_limit(self):
        state = arc_state(math.radians(5), LIMITS)

        assert round(state['right']) == 10

    def test_the_position_is_the_share_of_the_arc(self):
        state = arc_state(math.radians(5), LIMITS)

        assert abs(state['position'] - 20 / 30.0) < 1e-9

    def test_a_yaw_past_the_limit_is_held_at_it(self):
        assert arc_state(math.radians(40), LIMITS)['right'] == 0

    def test_a_turret_without_limits_has_no_readout(self):
        assert arc_state(0.2, None) is None

    def test_an_unknown_yaw_has_no_readout(self):
        assert arc_state(None, LIMITS) is None

    def test_inverted_limits_have_no_readout(self):
        assert arc_state(0.0, (0.3, -0.3)) is None


class SideColorTest(unittest.TestCase):

    def test_a_reached_limit_is_red(self):
        assert side_color(0.2, 5) == COLOR_DOWN

    def test_a_near_limit_is_a_warning(self):
        assert side_color(4, 5) == COLOR_WARN

    def test_a_far_limit_is_neutral(self):
        assert side_color(9, 5) == COLOR_NEUTRAL


class BarTest(unittest.TestCase):

    def test_the_bar_has_its_cells_between_two_ends(self):
        assert len(bar(0.5)) == BAR_CELLS + 2

    def test_the_mark_is_first_at_the_left_limit(self):
        assert bar(0.0)[1] == u'●'

    def test_the_mark_is_last_at_the_right_limit(self):
        assert bar(1.0)[-2] == u'●'


class FormatTest(unittest.TestCase):

    def test_the_panel_has_its_label(self):
        assert u'УГН' in panel_text(12)

    def test_the_panel_shows_the_degrees_to_the_left(self):
        assert u'◄ 27°' in panel_text(12)

    def test_the_panel_shows_the_degrees_to_the_right(self):
        assert u'3° ►' in panel_text(12)

    def test_a_near_limit_is_painted_as_a_warning(self):
        assert COLOR_WARN in panel_text(12)

    def test_the_bar_can_be_switched_off(self):
        assert u'●' not in panel_text(0, {'show_bar': False}, 'en')

    def test_the_degrees_stay_without_the_bar(self):
        assert u'15°' in panel_text(0, {'show_bar': False}, 'en')

    def test_no_state_has_no_panel(self):
        assert format_panel(None, Settings({}, SCHEMA), translator()) is None


class SettingsTest(unittest.TestCase):

    def test_the_preview_is_a_panel(self):
        assert u'УГН' in preview_text(Settings({}, SCHEMA), translator())

    def test_the_component_switch_is_battle_gun_arc(self):
        assert SETTINGS == ('battle_gun_arc',)

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
