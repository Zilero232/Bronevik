# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.format import COLOR_UP, strip_tags
from otmetki.core.moe import ThresholdCurve
from otmetki.core.settings import Settings
from otmetki.features.marks_panel.i18n import STRINGS
from otmetki.features.marks_panel.model import BattleTotals, format_panel, panel_state
from otmetki.features.marks_panel.model.preview import preview_text
from otmetki.features.marks_panel.settings import SCHEMA, SETTINGS, SWITCH

API = {'tank_id': 1, 'thresholds': {'65': 2000, '85': 2600, '95': 3100, '100': 4200}}
SNAPSHOT = {'tank_id': 1, 'moving_avg_damage': 2500, 'damage_rating': 8150, 'marks_on_gun': 1}


def translator(language='en'):
    return _support.translator(STRINGS, language)


def settings(**values):
    return Settings(values, SCHEMA)


def state(combined=2100, curve=True, pace=3000, **values):
    return panel_state(SNAPSHOT, combined, ThresholdCurve.from_api(API) if curve else None, pace, settings(**values))


class TotalsTest(unittest.TestCase):

    def test_best_assist_and_summary(self):
        totals = BattleTotals()
        assert totals.add('damage', 1500) and totals.add('radio', 400) and totals.add('track', 600)
        assert not totals.add('unknown', 100) and not totals.add('damage', -5) and not totals.add('stun', None)
        assert totals.combined() == 2100
        assert totals.apply_summary(damage=1800, stun=700)
        assert not totals.apply_summary(damage=1800, stun=700)
        assert totals.combined() == 1800 + 700
        assert not totals.apply_summary(damage=-1, stun='x')


class PanelTest(unittest.TestCase):

    def test_extended(self):
        text = strip_tags(format_panel(state(combined=5000), settings(), translator()))
        lines = text.split('\n')
        assert lines[0].startswith('MoE 81.50% ') and '(+' in lines[0]
        assert lines[1].startswith('damage 5 000')
        assert '(-' in strip_tags(format_panel(state(combined=0), settings(), translator()))
        assert u'65%: ✓' in lines[2] and '85%: ' in lines[2] and '100%' not in lines[2]
        assert lines[3].startswith('+0.5%: ') and 'to 85%: ~' in lines[3]

    def test_switches(self):
        text = strip_tags(format_panel(state(), settings(show_battle=False, show_targets=False, show_step=False, show_battles=False),
                                       translator()))
        assert text.count('\n') == 0

    def test_styles(self):
        compact = strip_tags(format_panel(state(), settings(style='compact'), translator()))
        assert '85%: ' in compact and '\n' not in compact
        minimal = strip_tags(format_panel(state(), settings(style='minimal'), translator()))
        assert minimal.endswith(')') and '85%' not in minimal
        custom = format_panel(state(), settings(style='custom', template='{percent}>{projected} {need95} [{battles}]'), translator())
        assert '81.50>' in strip_tags(custom) and '[' in custom
        assert settings(style='custom').get('template') == ''
        assert '81.50%' in strip_tags(format_panel(state(), settings(style='custom'), translator()))

    def test_colour_and_step(self):
        assert COLOR_UP in format_panel(state(combined=6000), settings(), translator())
        assert '+1%' in strip_tags(format_panel(state(step='1'), settings(step='1'), translator()))
        assert settings(step='2', color_mode='rainbow').get('step') == '0.5'

    def test_without_curve(self):
        text = strip_tags(format_panel(state(curve=False), settings(), translator('ru')))
        assert u'нет порогов' in text and '81.50%' in text

    def test_preview_and_strings(self):
        assert 'MoE 86.12%' in strip_tags(preview_text(settings(), translator()))
        assert u'Отметка' in strip_tags(preview_text(settings(), translator('ru')))
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])
        assert SETTINGS == (SWITCH,)


if __name__ == '__main__':
    unittest.main()
