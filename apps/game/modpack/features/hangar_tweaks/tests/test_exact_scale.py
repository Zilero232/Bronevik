from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.hangar_tweaks.i18n import STRINGS
from otmetki.features.hangar_tweaks.model import to_native
from otmetki.features.hangar_tweaks.model.scale import exact_scale, needs_scale
from otmetki.features.hangar_tweaks.settings import SCHEMA


class ExactScaleTest(unittest.TestCase):

    def test_the_exact_scale_is_off_by_default(self):
        assert exact_scale(Settings(None, SCHEMA).get('interface_scale_exact')) is None

    def test_a_percent_becomes_the_scale(self):
        assert exact_scale(130) == 1.3

    def test_under_the_lowest_step_is_off(self):
        assert exact_scale(49) is None
        assert exact_scale(True) is None

    def test_the_setting_is_clamped_to_three_times(self):
        assert Settings({'interface_scale_exact': 900}, SCHEMA).get('interface_scale_exact') == 300
        assert exact_scale(Settings({'interface_scale_exact': 900}, SCHEMA).get('interface_scale_exact')) == 3.0

    def test_a_scale_already_in_place_is_not_sent_again(self):
        assert not needs_scale(1.3, 1.3)
        assert needs_scale(1.25, 1.3)
        assert needs_scale(None, 1.3)
        assert not needs_scale(1.0, None)

    def test_the_exact_scale_is_never_written_as_a_client_setting(self):
        assert to_native({'interface_scale_exact': 130}) == {}

    def test_its_label_is_in_both_languages(self):
        assert 'hangar_tweaks_interface_scale_exact' in STRINGS['ru']
        assert 'hangar_tweaks_interface_scale_exact' in STRINGS['en']


if __name__ == '__main__':
    unittest.main()
