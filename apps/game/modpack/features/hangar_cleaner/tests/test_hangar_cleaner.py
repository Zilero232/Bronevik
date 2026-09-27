from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.hangar_cleaner.i18n import STRINGS
from otmetki.features.hangar_cleaner.model import EVENT_ENTRIES, OFFER_BANNERS, TEASER, hides
from otmetki.features.hangar_cleaner.settings import SCHEMA, SETTINGS


class HangarCleanerTest(unittest.TestCase):

    def test_defaults(self):
        values = Settings(None, SCHEMA).to_dict()
        assert hides(TEASER, values, True) and hides(OFFER_BANNERS, values, True)
        assert not hides(EVENT_ENTRIES, values, True)

    def test_switch_off_shows_everything(self):
        values = dict((key, True) for key in SCHEMA.defaults)
        assert not any(hides(element, values, False) for element in (TEASER, OFFER_BANNERS, EVENT_ENTRIES))
        assert not hides('unknown', values, True)

    def test_settings(self):
        assert SETTINGS == ('hangar_cleaner',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
