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
        assert (data['elapsed'], data['duration'], data['timer'], data['dim']) == (3, 10, True, True)
        assert sixth_sense_widget(lamp, Settings({'hide_after_s': 6}, SCHEMA), None, 100.2)['data']['duration'] == 6

    def test_custom_icon_or_text_only(self):
        lamp = SixthSense()
        lamp.observed(True, 0.0)
        assert sixth_sense_widget(lamp, Settings({'icon_set': 'custom', 'text': 'SPOTTED'}, SCHEMA), None, 1.0)['data']['icon'] is None
        assert sixth_sense_widget(lamp, Settings({'icon_set': 'custom'}, SCHEMA), None, 1.0)['data']['icon'] == 'otmetki:lamp'

    def test_fixture_for_the_page(self):
        assert _support.widget_fixture('sixth_sense', preview_widget(Settings({}, SCHEMA), None))


if __name__ == '__main__':
    unittest.main()
