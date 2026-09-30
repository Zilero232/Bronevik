from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.companion.config import Config
from otmetki.companion.settings_ui import record_user_set


class RecordUserSetTest(unittest.TestCase):

    def test_recorded_keys_join_the_user_set(self):
        config = Config({})

        record_user_set(config, ['hangar_tweaks', 'minimap.size'])

        assert config.get('user_set') == 'hangar_tweaks minimap.size'

    def test_a_key_already_recorded_changes_nothing(self):
        config = Config({'user_set': 'hangar_tweaks'})

        changed = record_user_set(config, ['hangar_tweaks'])

        assert changed is False

    def test_a_new_key_reports_the_change(self):
        assert record_user_set(Config({}), ['hangar_tweaks']) is True


if __name__ == '__main__':
    unittest.main()
