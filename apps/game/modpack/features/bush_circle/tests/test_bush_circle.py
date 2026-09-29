# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.features.bush_circle.i18n import STRINGS
from otmetki.features.bush_circle.model import CircleState, color_of, diameter, hotkey_of
from otmetki.features.bush_circle.model.constants import COLOR_CHOICES, HOTKEY_CHOICES, RADIUS_M
from otmetki.features.bush_circle.settings import CHOICES, SCHEMA, SETTINGS


class CircleStateTest(unittest.TestCase):

    def test_hotkey_mode_toggles(self):
        state = CircleState('hotkey')
        assert not state.wanted()
        assert state.toggle() and state.wanted()
        assert state.toggle() and not state.wanted()

    def test_always_mode_ignores_the_hotkey(self):
        state = CircleState('always')
        assert state.wanted() and not state.toggle() and state.wanted()

    def test_gone_once_the_tank_is_destroyed(self):
        state = CircleState('always')
        assert state.killed() and not state.killed()
        assert not state.wanted()


class ValuesTest(unittest.TestCase):

    def test_fixed_radius_colours_and_hotkeys(self):
        assert RADIUS_M == 15.0 and diameter() == 30.0
        assert color_of('green') == 0xFF7CD35B and color_of('purple') == 0xFFFFFFFF
        assert hotkey_of('ctrl_shift_b') == ('KEY_B', ('KEY_LCONTROL', 'KEY_LSHIFT')) and hotkey_of('bad') == (None, ())
        assert all(color in CHOICES['color'] for color in COLOR_CHOICES) and CHOICES['hotkey'] == HOTKEY_CHOICES

    def test_settings_and_strings(self):
        assert SETTINGS == ('battle_bush_circle',)
        assert SCHEMA.defaults['mode'] == 'hotkey'
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])
        for key, values in CHOICES.items():
            for value in values:
                assert 'bush_circle_%s_%s' % (key, value) in STRINGS['ru']


if __name__ == '__main__':
    unittest.main()
