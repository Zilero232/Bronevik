import copy
import io
import json
import os
import re
import sys
import unittest

BUILD_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if BUILD_DIR not in sys.path:
    sys.path.insert(0, BUILD_DIR)

import layout  # noqa: E402
from setupkit import ASSETS_DIR, CATALOG_PATH  # noqa: E402
from setupkit.manifest import catalog as catalog_module  # noqa: E402
from setupkit.manifest.generate import ManifestError, build_manifest  # noqa: E402

GAMEFACE = 'openwg_gameface'
GUIFLASH = 'guiflash'
# The renderer chain lives in core (core/client/hud: OpenWG Gameface, then GUIFlash); its users are the packages below.
RENDERER_HOST = 'core'
HUD_USE = re.compile(r'\bBattlePanel\b|\bhud_layer\(|\.ui\.show\(')
GAMEFACE_IMPORT = re.compile(r'^\s*(?:from\s+openwg_gameface\s+import|import\s+openwg_gameface)\b', re.MULTILINE)
SKIPPED_DIRS = ('tests', '__pycache__')


def load_raw():
    with io.open(CATALOG_PATH, encoding='utf-8') as handle:
        return json.load(handle)


def package_dir(key):
    feature = os.path.join(layout.FEATURES_DIR, key)
    return feature if os.path.isdir(feature) else os.path.join(layout.PACKAGES_DIR, key)


def sources(key):
    for folder, dirs, files in os.walk(package_dir(key)):
        dirs[:] = [name for name in dirs if name not in SKIPPED_DIRS]
        for name in files:
            if name.endswith('.py'):
                with io.open(os.path.join(folder, name), encoding='utf-8') as handle:
                    yield handle.read()


def keys_using(pattern):
    keys = [package.key for package in layout.split_packages('root_init.py') if package.key != RENDERER_HOST]
    return set(key for key in keys if any(pattern.search(text) for text in sources(key)))


class RequiredByFollowsTheCodeTest(unittest.TestCase):

    def setUp(self):
        self.catalog = catalog_module.load(CATALOG_PATH, ASSETS_DIR)
        self.by_id = dict((dependency.id, dependency) for dependency in self.catalog.dependencies)
        self.order = [entry.id for entry in self.catalog.components]

    def assert_required_by(self, dependency_id, expected):
        required_by = self.by_id[dependency_id].required_by
        self.assertEqual(set(required_by), expected, 'update requiredBy of %s in catalog/catalog.json' % dependency_id)
        self.assertEqual(list(required_by), sorted(required_by, key=self.order.index), 'keep requiredBy in catalog order')

    def test_hud_and_hangar_labels_need_both_renderers(self):
        labels = keys_using(HUD_USE)
        self.assertIn('marks_panel', labels)
        self.assertIn('hangar_marks', labels)
        self.assert_required_by(GUIFLASH, labels)

    def test_gameface_window_and_labels_need_gameface(self):
        window = keys_using(GAMEFACE_IMPORT)
        self.assertEqual(window, set(['ui']))
        self.assert_required_by(GAMEFACE, window | keys_using(HUD_USE))

    def test_pins_the_reviewed_releases(self):
        pins = dict((dependency.id, (dependency.file, dependency.sha256, dependency.size, dependency.licence.name))
                    for dependency in self.catalog.dependencies)
        self.assertEqual(pins, {
            GAMEFACE: ('net.openwg.gameface_1.2.2.mtmod', '2bb65f28663e3ab34b5a1102a1bbd1f6e17a65e1f6a898a8645c4ab732b50184', 48445, 'MIT'),
            GUIFLASH: ('gambiter.guiflash_0.6.6.mtmod', 'a0b6dc2e75663008a4ced9e0c00449be84b3c3d5d932f8bbcaa2b334ae3d1cb5', 62862, 'MIT'),
        })
        self.assertTrue(self.by_id[GAMEFACE].restart_required)
        self.assertFalse(self.by_id[GUIFLASH].restart_required)


class DependencyCatalogTest(unittest.TestCase):

    def problems(self, mutate, dependency_id=GUIFLASH):
        raw = copy.deepcopy(load_raw())
        mutate(next(entry for entry in raw['components'] if entry['id'] == dependency_id))
        with self.assertRaises(catalog_module.CatalogError) as context:
            catalog_module.parse(raw, ASSETS_DIR)
        return '\n'.join(context.exception.problems)

    def test_dependencies_are_not_catalogue_entries(self):
        catalog = catalog_module.load(CATALOG_PATH, ASSETS_DIR)
        self.assertEqual([dependency.id for dependency in catalog.dependencies], [GAMEFACE, GUIFLASH])
        self.assertIsNone(catalog.entry(GAMEFACE))

    def test_rejects_our_names(self):
        self.assertIn('is ours', self.problems(lambda entry: entry.update(packageId='net.triotmetki.guiflash',
                                                                           file='net.triotmetki.guiflash_0.6.6.mtmod')))
        self.assertIn('matches ownedPatterns', self.problems(lambda entry: entry.update(packageId='otmetki.guiflash', file='otmetki.guiflash_0.6.6.mtmod')))

    def test_rejects_unpinned_or_mismatched_files(self):
        self.assertIn('file must be gambiter.guiflash_0.6.6.mtmod', self.problems(lambda entry: entry.update(file='guiflash.mtmod')))
        self.assertIn('file must be', self.problems(lambda entry: entry.update(version='0.6.7')))
        self.assertIn('.sha256: must be a lowercase 64-hex sha256', self.problems(lambda entry: entry.update(sha256='abc')))
        self.assertIn('.size: must be', self.problems(lambda entry: entry.update(size=0)))
        self.assertIn('.sourceUrl: must be an https:// link', self.problems(lambda entry: entry.update(sourceUrl='http://example.com/x.mtmod')))

    def test_rejects_a_missing_licence(self):
        self.assertIn('.licence.sha256: must be', self.problems(lambda entry: entry['licence'].pop('sha256')))
        self.assertIn('.licence.name: must be', self.problems(lambda entry: entry['licence'].update(name='')))
        self.assertIn('.licence.url: must be an https:// link', self.problems(lambda entry: entry['licence'].update(url='LICENSE')))
        self.assertIn('.author.url: must be an https:// link', self.problems(lambda entry: entry.pop('author')))

    def test_rejects_catalogue_fields_and_unknown_components(self):
        self.assertIn('a dependency has no category', self.problems(lambda entry: entry.update(category='battle')))
        self.assertIn("unknown component 'nothing'", self.problems(lambda entry: entry['requiredBy'].append('nothing')))
        self.assertIn("unknown component 'guiflash'", self.problems(lambda entry: entry['requiredBy'].append('guiflash')))
        self.assertIn('requiredBy: list the ids', self.problems(lambda entry: entry.update(requiredBy=[])))
        self.assertIn('twice', self.problems(lambda entry: entry['requiredBy'].append('marks_panel')))
        self.assertIn('restartRequired: must be', self.problems(lambda entry: entry.pop('restartRequired')))
        self.assertIn('unknown kind', self.problems(lambda entry: entry.update(kind='library')))
        self.assertIn('duplicate id', self.problems(lambda entry: entry.update(id='marks_panel')))


class DependencyManifestTest(unittest.TestCase):

    def setUp(self):
        self.catalog = catalog_module.load(CATALOG_PATH, ASSETS_DIR)
        self.raw = dict((entry['id'], entry) for entry in load_raw()['components'] if entry.get('kind') == 'dependency')

    def test_passes_the_entries_through_as_the_catalog_pins_them(self):
        manifest, warnings = build_manifest(layout.split_packages('root_init.py'), self.catalog, strict=True)
        data = manifest.to_json()
        entries = [entry for entry in data['components'] if entry.get('kind') == 'dependency']
        self.assertEqual(entries, [self.raw[GAMEFACE], self.raw[GUIFLASH]])
        self.assertTrue(all('kind' not in entry for entry in data['components'][:len(manifest.components)]))
        self.assertNotIn('dependencies', data)
        self.assertEqual(warnings, [])

    def test_keeps_only_the_components_a_build_ships(self):
        packages = [package for package in layout.split_packages('root_init.py') if package.key in ('core', 'companion', 'ui', 'sixth_sense')]
        manifest, warnings = build_manifest(packages, self.catalog)
        self.assertEqual(dict((dependency.id, dependency.required_by) for dependency in manifest.dependencies),
                         {GAMEFACE: ('ui', 'sixth_sense'), GUIFLASH: ('sixth_sense',)})
        self.assertEqual(manifest.dependencies_of('sixth_sense'), manifest.dependencies)
        self.assertTrue(any('dependency guiflash is required by marks_panel' in warning for warning in warnings))
        with self.assertRaises(ManifestError):
            build_manifest(packages, self.catalog, strict=True)

    def test_drops_a_dependency_nothing_in_the_build_needs(self):
        packages = [package for package in layout.split_packages('root_init.py') if package.key in ('core', 'companion', 'ui')]
        manifest, _ = build_manifest(packages, self.catalog)
        self.assertEqual([dependency.id for dependency in manifest.dependencies], [GAMEFACE])


if __name__ == '__main__':
    unittest.main()
