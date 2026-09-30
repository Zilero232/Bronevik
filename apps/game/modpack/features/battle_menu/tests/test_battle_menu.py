# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.hud.surface import KIND_BUTTON
from otmetki.core.settings import Settings
from otmetki.features.battle_menu.i18n import STRINGS
from otmetki.features.battle_menu.model import button_props
from otmetki.features.battle_menu.settings import SCHEMA, SETTINGS


def settings(values=None):
    return Settings(values or {}, SCHEMA)


class ButtonTest(unittest.TestCase):

    def test_the_button_is_a_button_panel(self):
        assert button_props(settings(), u'hint')['kind'] == KIND_BUTTON

    def test_the_button_is_never_dragged_so_it_stays_clickable(self):
        assert button_props(settings(), u'hint')['drag'] is False

    def test_the_button_is_centred_with_the_menu(self):
        props = button_props(settings(), u'hint')

        assert (props['alignX'], props['alignY']) == ('center', 'center')

    def test_the_button_sits_under_the_menu_by_default(self):
        assert button_props(settings(), u'hint')['y'] > 0

    def test_the_players_offset_moves_it(self):
        props = button_props(settings({'x': 40, 'y': -60}), u'hint')

        assert (props['x'], props['y']) == (40, -60)

    def test_the_size_is_a_fraction(self):
        assert button_props(settings({'scale': 150}), u'hint')['scale'] == 1.5

    def test_the_button_carries_its_tooltip(self):
        assert button_props(settings(), u'hint')['hint'] == u'hint'


class SettingsTest(unittest.TestCase):

    def test_the_switch_is_battle_menu_entry(self):
        assert SETTINGS == ('battle_menu_entry',)

    def test_the_offset_is_capped(self):
        assert settings({'y': 5000}).get('y') == 500

    def test_every_setting_has_a_label(self):
        for key in ('x', 'y', 'scale'):
            assert 'battle_menu_' + key in STRINGS['ru']

    def test_both_languages_have_the_same_strings(self):
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
