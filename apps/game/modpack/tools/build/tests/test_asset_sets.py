import io
import os
import sys
import unittest

import _support  # noqa: F401

BUILD_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS_DIR = os.path.dirname(BUILD_DIR)
for path in (BUILD_DIR, os.path.join(TOOLS_DIR, 'assets')):
    if path not in sys.path:
        sys.path.insert(0, path)

import asset_sets  # noqa: E402
import layout  # noqa: E402
import render  # noqa: E402


class AssetSetsTest(unittest.TestCase):

    def setUp(self):
        self.sets = asset_sets.load()

    def test_every_set_has_licence_metadata(self):
        self.assertEqual(asset_sets.problems(self.sets), [])
        for asset_set in self.sets:
            self.assertTrue(os.path.isfile(asset_set.path(asset_set.license_file)), asset_set.id)
            if asset_set.origin == 'third_party':
                self.assertIn(asset_set.license, asset_sets.PERMISSIVE_LICENCES, asset_set.id)
                self.assertTrue(asset_set.url.startswith('https://'), asset_set.id)

    def test_no_binary_asset_outside_a_set(self):
        listed = set()
        for asset_set in self.sets:
            listed.update(os.path.normcase(os.path.join(asset_set.path(asset_set.files), name)) for name in asset_set.file_names())
        for directory, _, files in os.walk(asset_sets.ASSETS_DIR):
            for name in files:
                if os.path.splitext(name)[1].lower() in asset_sets.ASSET_EXTENSIONS and os.sep + 'src' not in directory:
                    self.assertIn(os.path.normcase(os.path.join(directory, name)), listed)

    def test_problems_catch_a_non_commercial_licence(self):
        third_party = [asset_set for asset_set in self.sets if asset_set.origin == 'third_party'][0]
        bad = dict(third_party.data, id='nc', license='CC-BY-NC-4.0')
        self.assertTrue([problem for problem in asset_sets.problems([asset_sets.AssetSet(bad)]) if 'not allowed' in problem])
        own = dict(third_party.data, id='own', license=asset_sets.ORIGINAL_LICENCE)
        self.assertTrue(asset_sets.problems([asset_sets.AssetSet(own)]))

    def test_notices_are_current_and_name_every_set(self):
        self.assertEqual(asset_sets.main([]), 0)
        with io.open(asset_sets.NOTICES, encoding='utf-8') as handle:
            text = handle.read()
        for asset_set in self.sets:
            self.assertIn(asset_set.title, text)
            self.assertIn(asset_set.license, text)
        self.assertIn('Kenney', text)
        self.assertIn('Original artwork, (c) Три отметки', text)

    def test_every_source_is_rendered(self):
        for asset_set in self.sets:
            for output, _, _ in render.planned(asset_set):
                self.assertTrue(os.path.isfile(output), output)

    def test_build_ships_files_licences_and_notices(self):
        packages = dict((package.key, package) for package in layout.split_packages('root_init.py'))
        for asset_set in self.sets:
            paths = [path for _, path in packages[asset_set.feature].files]
            for name in asset_set.file_names():
                self.assertIn('%s/%s' % (asset_set.target, name), paths)
            self.assertIn(asset_set.license_target, paths)
            self.assertIn('%s/%s/%s' % (asset_sets.ICONS_ROOT, asset_set.feature, asset_sets.NOTICES_NAME), paths)
        sixth = [path for _, path in packages['sixth_sense'].files]
        self.assertIn('res/audioww/sixthSense.mp3', sixth)
        self.assertIn('res/audioww/sixthSense_off.mp3', sixth)
        self.assertFalse([path for _, path in packages['team_hp'].files if not path.endswith('.py')])
        single = [path for _, path in layout.single_package('root_init.py').files]
        self.assertIn('res/gui/maps/icons/otmetki/crosshair/kenney/License.txt', single)


if __name__ == '__main__':
    unittest.main()
