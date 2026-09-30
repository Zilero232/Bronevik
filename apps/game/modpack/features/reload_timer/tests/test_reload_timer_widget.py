# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.reload_timer.model import GunState
from otmetki.features.reload_timer.model.preview import preview_gun, preview_widget
from otmetki.features.reload_timer.model.widget import reload_widget
from otmetki.features.reload_timer.settings import SCHEMA


class ReloadWidgetTest(unittest.TestCase):

    def test_reload_and_magazine(self):
        data = reload_widget(preview_gun(), Settings({}, SCHEMA))['data']

        assert data['left'] == 3.2
        assert data['total'] == 7.8
        assert data['ready'] is False
        assert data['clip'] == 4
        assert data['in_clip'] == 3

    def test_default_switches(self):
        data = reload_widget(preview_gun(), Settings({}, SCHEMA))['data']

        assert data['show_bar'] is True
        assert data['show_clip'] is True
        assert data['show_ready'] is False

    def test_a_gun_without_a_reload_is_ready(self):
        data = reload_widget(GunState(), Settings({}, SCHEMA))['data']

        assert data['ready'] is True

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('reload_timer', preview_widget(Settings({}, SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
