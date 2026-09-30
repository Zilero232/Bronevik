import contextlib
import copy
import hashlib
import importlib
import io
import json
import os
import shutil
import sys
import tempfile
import unittest

BUILD_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if BUILD_DIR not in sys.path:
    sys.path.insert(0, BUILD_DIR)

import archive  # noqa: E402
import layout  # noqa: E402
from setupkit import ASSETS_DIR, CATALOG_PATH  # noqa: E402
from setupkit.manifest import catalog as catalog_module  # noqa: E402
from setupkit.manifest.generate import ManifestError, build_manifest  # noqa: E402
from setupkit.manifest.model import camel  # noqa: E402


def load_raw():
    with io.open(CATALOG_PATH, encoding='utf-8') as handle:
        return json.load(handle)


def fake_package(key, depends=(), name=None):
    return layout.Package(key, 'net.triotmetki.' + key, name or 'Three Marks: ' + key, '0.1.0', 'desc ' + key, [], depends)


class CatalogTest(unittest.TestCase):

    def test_repo_catalog_is_valid(self):
        catalog = catalog_module.load(CATALOG_PATH, ASSETS_DIR)
        self.assertEqual(catalog.default_preset, 'recommended')
        self.assertEqual([preset.id for preset in catalog.presets], ['recommended', 'minimal', 'streamer', 'custom'])
        self.assertTrue(catalog.presets[-1].custom)
        self.assertEqual(set(entry.id for entry in catalog.components if entry.required), set(['core', 'companion', 'ui']))

    def test_every_current_package_is_catalogued(self):
        catalog = catalog_module.load(CATALOG_PATH, ASSETS_DIR)
        missing = [package.key for package in layout.split_packages('root_init.py') if catalog.entry(package.key) is None]
        self.assertEqual(missing, [], 'add these packages to catalog/catalog.json')

    def problems(self, mutate):
        raw = copy.deepcopy(load_raw())
        mutate(raw)
        with self.assertRaises(catalog_module.CatalogError) as context:
            catalog_module.parse(raw, ASSETS_DIR)
        return '\n'.join(context.exception.problems)

    def entry(self, raw, component_id):
        return next(entry for entry in raw['components'] if entry['id'] == component_id)

    def test_rejects_bad_catalogs(self):
        self.assertIn('unknown category', self.problems(lambda raw: self.entry(raw, 'marks_panel').update(category='nowhere')))
        self.assertIn('unknown or custom preset', self.problems(lambda raw: self.entry(raw, 'marks_panel').update(presets=['custom'])))
        self.assertIn('missing en text', self.problems(lambda raw: self.entry(raw, 'marks_panel')['title'].update(en='')))
        self.assertIn('control characters', self.problems(lambda raw: self.entry(raw, 'marks_panel')['title'].update(ru='a' + chr(9) + 'b')))
        self.assertIn('not found in catalog/', self.problems(lambda raw: self.entry(raw, 'marks_panel').update(preview={'image': 'previews/none.svg'})))
        self.assertIn('https://', self.problems(lambda raw: self.entry(raw, 'marks_panel').update(preview={'video': 'http://x'})))
        self.assertIn('unknown dependency', self.problems(lambda raw: self.entry(raw, 'marks_panel').update(dependencies=['nothing'])))
        self.assertIn('drop its presets', self.problems(lambda raw: self.entry(raw, 'core').update(presets=['minimal'])))
        self.assertIn('duplicate id', self.problems(lambda raw: raw['components'].append(copy.deepcopy(raw['components'][0]))))
        self.assertIn('id must match', self.problems(lambda raw: self.entry(raw, 'marks_panel').update(id='Marks-Panel')))
        self.assertIn('must come last', self.problems(lambda raw: raw['presets'].reverse()))
        self.assertIn('bare package file mask', self.problems(lambda raw: raw.update(ownedPatterns=['mods/*.mtmod'])))
        self.assertIn('perf must be one of', self.problems(lambda raw: self.entry(raw, 'marks_panel').update(perf='huge')))
        self.assertIn('perf must be one of', self.problems(lambda raw: self.entry(raw, 'marks_panel').pop('perf')))
        self.assertIn('context must be one of', self.problems(lambda raw: self.entry(raw, 'marks_panel').update(context='lobby')))
        self.assertIn('context must be one of', self.problems(lambda raw: self.entry(raw, 'marks_panel').pop('context')))
        self.assertIn('not found in assets/', self.problems(lambda raw: self.entry(raw, 'sixth_sense')['preview'].update(audio='otmetki/none.mp3')))
        self.assertIn('preview audio must be', self.problems(lambda raw: self.entry(raw, 'sixth_sense')['preview'].update(audio='../x.mp3')))
        self.assertIn('unknown component', self.problems(lambda raw: raw['conflicts'][0].update(components=['nothing'])))
        self.assertIn('names our own packages', self.problems(lambda raw: raw['conflicts'][0].update(patterns=['net.triotmetki.*'])))
        self.assertIn('some fixed text', self.problems(lambda raw: raw['conflicts'][0].update(patterns=['*'])))
        self.assertIn('without res/', self.problems(lambda raw: raw.update(ownedPaths=['res/scripts/'])))

    def test_every_component_has_a_perf_mark_and_sounds_have_a_preview(self):
        catalog = catalog_module.load(CATALOG_PATH, ASSETS_DIR)
        self.assertTrue(all(entry.perf in ('low', 'medium', 'high') for entry in catalog.components))
        self.assertTrue(all(entry.context in ('hangar', 'battle', 'any') for entry in catalog.components))
        self.assertEqual(set(entry.id for entry in catalog.components if entry.preview.audio), set(['sixth_sense', 'personal_best', 'session_goals']))
        self.assertIn('scripts/client/gui/mods/otmetki/', catalog.owned_paths)
        self.assertTrue(any(rule.id == 'xvm' for rule in catalog.conflicts))


class ManifestTest(unittest.TestCase):

    def setUp(self):
        self.catalog = catalog_module.load(CATALOG_PATH, ASSETS_DIR)
        core = fake_package('core')
        companion = fake_package('companion', [core])
        self.packages = [core, companion, fake_package('marks_panel', [core, companion]), fake_package('sixth_sense', [core, companion])]

    def test_merges_layout_and_catalog(self):
        manifest, warnings = build_manifest(self.packages, self.catalog)
        by_id = dict((component.id, component) for component in manifest.components)
        self.assertEqual([component.id for component in manifest.components], ['core', 'companion', 'marks_panel', 'sixth_sense'])
        panel = by_id['marks_panel']
        self.assertEqual(panel.file, 'net.triotmetki.marks_panel_0.1.0.mtmod')
        self.assertEqual(panel.dependencies, ('core', 'companion'))
        self.assertEqual(panel.presets, ('recommended', 'minimal', 'streamer'))
        self.assertTrue(panel.default and panel.catalogued and not panel.required)
        self.assertEqual(panel.preview.image, 'previews/marks_panel.png')
        self.assertEqual(panel.title.ru, 'Отметка в бою')
        self.assertTrue(by_id['core'].required)
        self.assertEqual(by_id['core'].presets, ('recommended', 'minimal', 'streamer', 'custom'))
        self.assertEqual([category.id for category in manifest.categories], ['base', 'battle'])
        self.assertEqual(manifest.extension, 'mtmod')
        self.assertIn('catalog entry ui has no package (not built by this layout)', warnings)

    def test_json_is_camel_case(self):
        manifest, _ = build_manifest(self.packages, self.catalog)
        data = manifest.to_json()
        self.assertEqual(data['schemaVersion'], 1)
        component = data['components'][2]
        self.assertEqual(sorted(component), sorted(['id', 'packageId', 'version', 'file', 'category', 'title', 'description', 'fairPlay', 'required',
                                                    'default', 'presets', 'preview', 'dependencies', 'catalogued', 'sha256', 'size', 'perf',
                                                    'context']))
        self.assertEqual(component['perf'], 'low')
        self.assertEqual(component['context'], 'battle')
        self.assertEqual(data['components'][3]['preview']['audio'], 'previews/sixth_sense.mp3')
        self.assertEqual([rule['id'] for rule in data['conflicts']], ['xvm', 'battle_observer', 'marks_calculator', 'sixth_sense_lamp'])
        self.assertEqual(data['conflicts'][0]['components'], ['sixth_sense'])
        self.assertIn('gui/gameface/mods/triotmetki/', data['ownedPaths'])
        self.assertEqual(component['title'], {'ru': 'Отметка в бою', 'en': 'MoE panel in battle'})
        self.assertEqual(camel('fair_play'), 'fairPlay')
        json.dumps(data)

    def test_uncatalogued_package_ships_unticked(self):
        core = self.packages[0]
        extra = fake_package('brand_new', [core, self.packages[1]], name='Three Marks: brand new')
        manifest, warnings = build_manifest(self.packages + [extra], self.catalog)
        component = manifest.component('brand_new')
        self.assertEqual((component.category, component.default, component.catalogued), ('other', False, False))
        self.assertEqual(component.title.ru, 'Three Marks: brand new')
        self.assertEqual(manifest.components[-1].id, 'brand_new')
        self.assertTrue(any('brand_new has no catalog entry' in warning for warning in warnings))
        with self.assertRaises(ManifestError):
            build_manifest(self.packages + [extra], self.catalog, strict=True)

    def test_missing_dependency_and_foreign_file_names_fail(self):
        with self.assertRaises(ManifestError) as context:
            build_manifest(self.packages[1:], self.catalog)
        self.assertIn('depends on core', str(context.exception))
        foreign = layout.Package('marks_panel', 'com.someone.panel', 'x', '1', 'x', [], [])
        with self.assertRaises(ManifestError) as context:
            build_manifest([foreign], self.catalog)
        self.assertIn('matches no ownedPatterns', str(context.exception))

    def test_hashes_built_packages(self):
        folder = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, folder)
        for package in self.packages:
            with open(os.path.join(folder, archive.file_name(package, 'lesta')), 'wb') as handle:
                handle.write(package.key.encode('ascii'))
        manifest, _ = build_manifest(self.packages, self.catalog, packages_dir=folder)
        core = manifest.component('core')
        self.assertEqual((core.sha256, core.size), (hashlib.sha256(b'core').hexdigest(), 4))
        os.remove(os.path.join(folder, archive.file_name(self.packages[-1], 'lesta')))
        with self.assertRaises(ManifestError):
            build_manifest(self.packages, self.catalog, packages_dir=folder)

    def test_real_layout(self):
        manifest, _ = build_manifest(layout.split_packages('root_init.py'), self.catalog)
        ids = [component.id for component in manifest.components]
        self.assertEqual(ids[:2], ['core', 'companion'])
        for component in manifest.components:
            for dependency in component.dependencies:
                self.assertIn(dependency, ids)


class CliTest(unittest.TestCase):

    def test_writes_components_json_for_the_manager(self):
        cli = importlib.import_module('setupkit.__main__')
        folder = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, folder)
        with contextlib.redirect_stdout(io.StringIO()):
            cli.main(['--out', folder, '--skip-artwork'])
        with io.open(os.path.join(folder, 'components.json'), encoding='utf-8') as handle:
            data = json.load(handle)
        keys = [package.key for package in layout.split_packages('root_init.py')]
        self.assertEqual(sorted(component['id'] for component in data['components'] if 'kind' not in component), sorted(keys))
        dependencies = [component['id'] for component in data['components'] if component.get('kind') == 'dependency']
        self.assertEqual(dependencies, ['openwg_gameface', 'guiflash', 'modslist'])
        self.assertTrue(cli.DEFAULT_OUT.endswith(os.path.join('dist', 'catalog')))
        sixth_sense = next(component for component in data['components'] if component['id'] == 'sixth_sense')
        self.assertTrue(os.path.isfile(os.path.join(folder, *sixth_sense['preview']['audio'].split('/'))))


if __name__ == '__main__':
    unittest.main()
