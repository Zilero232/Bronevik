# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.format import MARK_COLORS, strip_tags
from otmetki.core.moe import ThresholdCurve, battles_to_reach
from otmetki.core.settings import Settings
from otmetki.features.hangar_marks.i18n import STRINGS
from otmetki.features.hangar_marks.model import format_panel, hangar_state
from otmetki.features.hangar_marks.model.preview import preview_text
from otmetki.features.hangar_marks.settings import GROUP, SCHEMA, SETTINGS, SWITCH

CURVE = {'thresholds': {'65': 2000, '85': 2600, '95': 3100}}
SNAPSHOT = {'tank_id': 1, 'moving_avg_damage': 2500, 'damage_rating': 8150, 'marks_on_gun': 1}


def translator(language='en'):
    return _support.translator(STRINGS, language)


def render(pace=3000, curve=True, **values):
    state = hangar_state(SNAPSHOT, ThresholdCurve.from_api(CURVE) if curve else None, pace)
    return format_panel(state, Settings(values, SCHEMA), translator())


class HangarMarksTest(unittest.TestCase):

    def test_extended(self):
        lines = strip_tags(render()).split('\n')
        assert lines[0] == u'MoE 81.50% ★'
        assert lines[1].startswith('average 2 500 · pace 3 000')
        assert u'65%: ✓' in lines[2] and '95%: ' in lines[2]
        assert lines[3] == 'to 85%% (average 2 600): ~%d battles' % battles_to_reach(2500, 2600, 3000)
        assert MARK_COLORS[1] in render()

    def test_forecast_without_pace_or_curve(self):
        assert strip_tags(render(pace=None)).endswith('~-')
        assert strip_tags(render(pace=2400)).endswith(u'~∞')
        text = strip_tags(render(curve=False))
        assert 'no thresholds' in text and '95%' not in text

    def test_styles_and_switches(self):
        assert '\n' not in strip_tags(render(style='compact'))
        assert strip_tags(render(style='custom', template='{percent}|{need85}')) == '81.50|' + strip_tags(render()).split('85%: ')[1].split('   ')[0]
        assert strip_tags(render(show_targets=False, show_forecast=False)).count('\n') == 1
        assert 'color="#F2EAD3"' in render(color_mode='off').split('\n')[0]

    def test_preview_and_descriptor(self):
        assert 'MoE 86.12%' in strip_tags(preview_text(Settings({}, SCHEMA), translator()))
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])
        assert SETTINGS == (SWITCH,) and GROUP == 'hangar'


if __name__ == '__main__':
    unittest.main()
