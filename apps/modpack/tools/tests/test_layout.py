import importlib
import os
import unittest

import _support
from otmetki.companion.config import DEFAULTS, FEATURES
from otmetki.companion.i18n import STRINGS as COMPANION_STRINGS

FEATURE_FILES = ('model', 'client', 'settings', 'i18n')
HUD_FEATURES = ('battle_clock', 'battle_results', 'damage_log', 'hit_log', 'sixth_sense', 'team_hp')


class FeatureLayoutTest(unittest.TestCase):

    def test_features_found(self):
        found = set(_support.feature_ids())
        self.assertTrue(set(('marks_panel', 'replay_upload', 'session_stats') + HUD_FEATURES) <= found, sorted(found))

    def test_feature_layout(self):
        for feature_id in _support.feature_ids():
            base = os.path.join(_support.FEATURES_DIR, feature_id)
            self.assertTrue(os.path.isfile(os.path.join(base, '__init__.py')), feature_id)
            for name in FEATURE_FILES:
                is_module = os.path.isfile(os.path.join(base, name + '.py'))
                is_package = os.path.isfile(os.path.join(base, name, '__init__.py'))
                self.assertTrue(is_module or is_package, '%s/%s' % (feature_id, name))
            self.assertTrue(os.path.isdir(os.path.join(base, 'tests')), feature_id)
            entry = os.path.join(base, 'entry', 'mod_otmetki_%s.py' % feature_id)
            self.assertTrue(os.path.isfile(entry), entry)

    def test_feature_descriptor(self):
        for feature_id in _support.feature_ids():
            package = importlib.import_module('otmetki.features.' + feature_id)
            self.assertEqual(package.FEATURE_ID, feature_id)
            self.assertTrue(package.PACKAGE_ID.endswith(feature_id))
            self.assertTrue(callable(package.create) and callable(package.register))

    def test_feature_settings_live_in_the_companion_schema(self):
        for feature_id in _support.feature_ids():
            settings = importlib.import_module('otmetki.features.%s.settings' % feature_id)
            for key in settings.SETTINGS:
                self.assertIn(key, DEFAULTS, '%s: %s' % (feature_id, key))

    def test_feature_strings_do_not_shadow_the_companion(self):
        for feature_id in _support.feature_ids():
            strings = importlib.import_module('otmetki.features.%s.i18n' % feature_id).STRINGS
            for language, entries in strings.items():
                self.assertFalse(set(entries) & set(COMPANION_STRINGS[language]), '%s/%s' % (feature_id, language))

    def test_every_switch_has_a_label(self):
        for language in ('ru', 'en'):
            for key in ('enabled',) + tuple(FEATURES):
                self.assertIn(key, COMPANION_STRINGS[language])


if __name__ == '__main__':
    unittest.main()
