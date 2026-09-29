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
        assert (data['left'], data['total'], data['ready'], data['clip'], data['in_clip']) == (3.2, 7.8, False, 4, 3)
        assert data['show_bar'] and data['show_clip'] and not data['show_ready']
        assert reload_widget(GunState(), Settings({}, SCHEMA))['data']['ready'] is True

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('reload_timer', preview_widget(Settings({}, SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
