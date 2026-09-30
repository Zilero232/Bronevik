# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.core.settings import Settings
from otmetki.features.sixth_sense.model import SixthSense
from otmetki.features.sixth_sense.model.preview import preview_widget
from otmetki.features.sixth_sense.model.widget import sixth_sense_widget
from otmetki.features.sixth_sense.settings import SCHEMA


class SixthSenseWidgetTest(unittest.TestCase):

    def test_lamp_with_a_draining_ring(self):
        lamp = SixthSense()
        lamp.observed(True, 100.0)

        data = sixth_sense_widget(lamp, Settings({}, SCHEMA), None, 103.6)['data']

        assert data['icon'] == 'img://gui/maps/icons/otmetki/sixth_sense/icons/lamp_64.png|otmetki:lamp'
        assert data['elapsed'] == 3.6
        assert data['duration'] == 10.0
        assert data['timer']
        assert data['dim']

    def test_the_ring_drains_over_the_lamps_own_duration(self):
        lamp = SixthSense()
        lamp.observed(True, 100.0, 8.5)

        data = sixth_sense_widget(lamp, Settings({}, SCHEMA), None, 102.0)['data']

        assert data['elapsed'] == 2.0
        assert data['duration'] == 8.5

    def test_the_elapsed_time_stops_at_the_duration(self):
        lamp = SixthSense()
        lamp.observed(True, 100.0, 8.0)

        data = sixth_sense_widget(lamp, Settings({}, SCHEMA), None, 130.0)['data']

        assert data['elapsed'] == 8.0

    def test_the_preview_ring_follows_the_players_own_time(self):
        data = preview_widget(Settings({'hide_after_s': 6}, SCHEMA), None)['data']

        assert data['duration'] == 6.0

    def test_custom_icon_or_text_only(self):
        lamp = SixthSense()
        lamp.observed(True, 0.0)
        assert sixth_sense_widget(lamp, Settings({'icon_set': 'custom', 'text': 'SPOTTED'}, SCHEMA), None, 1.0)['data']['icon'] is None
        assert sixth_sense_widget(lamp, Settings({'icon_set': 'custom'}, SCHEMA), None, 1.0)['data']['icon'] == 'otmetki:lamp'

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('sixth_sense', preview_widget(Settings({}, SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
