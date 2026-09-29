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


def translator(language='ru'):
    return _support.translator(STRINGS, language)


LIMITS = (math.radians(-15), math.radians(15))


class ArcTest(unittest.TestCase):

    def test_degrees_left_to_each_limit(self):
        state = arc_state(math.radians(5), LIMITS)
        assert round(state['left']) == 20 and round(state['right']) == 10
        assert abs(state['position'] - 20 / 30.0) < 1e-9
        assert arc_state(math.radians(40), LIMITS)['right'] == 0

    def test_no_limits_no_readout(self):
        assert arc_state(0.2, None) is None
        assert arc_state(None, LIMITS) is None
        assert arc_state(0.0, (0.3, -0.3)) is None

    def test_colors_and_bar(self):
        assert side_color(0.2, 5) == COLOR_DOWN and side_color(4, 5) == COLOR_WARN and side_color(9, 5) == COLOR_NEUTRAL
        assert len(bar(0.5)) == BAR_CELLS + 2 and bar(0.0)[1] == u'●' and bar(1.0)[-2] == u'●'

    def test_format(self):
        text = format_panel(arc_state(math.radians(12), LIMITS), Settings({}, SCHEMA), translator())
        assert u'УГН' in text and u'◄ 27°' in text and u'3° ►' in text and COLOR_WARN in text
        plain = format_panel(arc_state(0.0, LIMITS), Settings({'show_bar': False}, SCHEMA), translator('en'))
        assert u'●' not in plain and u'15°' in plain
        assert format_panel(None, Settings({}, SCHEMA), translator()) is None

    def test_preview_settings_and_strings(self):
        assert u'УГН' in preview_text(Settings({}, SCHEMA), translator())
        assert SETTINGS == ('battle_gun_arc',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
