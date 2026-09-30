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

COMPONENT_KEYS = [
    'id', 'packageId', 'version', 'file', 'category', 'title', 'description', 'fairPlay', 'required', 'default',
    'presets', 'preview', 'dependencies', 'catalogued', 'sha256', 'size', 'perf', 'context',
]


def load_raw():
    with io.open(CATALOG_PATH, encoding='utf-8') as handle:
        return json.load(handle)


def load_catalog():
    return catalog_module.load(CATALOG_PATH, ASSETS_DIR)


def fake_package(key, depends=(), name=None):
    title = name or 'Three Marks: ' + key
    return layout.Package(key, 'net.triotmetki.' + key, title, '0.1.0', 'desc ' + key, [], depends)


def raw_entry(raw, component_id):
    return next(entry for entry in raw['components'] if entry['id'] == component_id)


def update_entry(component_id, **fields):
    return lambda raw: raw_entry(raw, component_id).update(fields)


def drop_entry_field(component_id, field):
    return lambda raw: raw_entry(raw, component_id).pop(field)


def update_title(component_id, **texts):
    return lambda raw: raw_entry(raw, component_id)['title'].update(texts)


def update_preview(component_id, **fields):
    return lambda raw: raw_entry(raw, component_id)['preview'].update(fields)


def update_first_conflict(**fields):
    return lambda raw: raw['conflicts'][0].update(fields)


def update_root(**fields):
    return lambda raw: raw.update(fields)


def duplicate_first_component(raw):
    raw['components'].append(copy.deepcopy(raw['components'][0]))


def reverse_presets(raw):
    raw['presets'].reverse()


BAD_CATALOGS = (
    ('unknown category', update_entry('marks_panel', category='nowhere')),
    ('unknown or custom preset', update_entry('marks_panel', presets=['custom'])),
    ('missing en text', update_title('marks_panel', en='')),
    ('control characters', update_title('marks_panel', ru='a' + chr(9) + 'b')),
    ('not found in catalog/', update_entry('marks_panel', preview={'image': 'previews/none.svg'})),
    ('https://', update_entry('marks_panel', preview={'video': 'http://x'})),
    ('unknown dependency', update_entry('marks_panel', dependencies=['nothing'])),
    ('drop its presets', update_entry('core', presets=['minimal'])),
    ('duplicate id', duplicate_first_component),
    ('id must match', update_entry('marks_panel', id='Marks-Panel')),
    ('must come last', reverse_presets),
    ('bare package file mask', update_root(ownedPatterns=['mods/*.mtmod'])),
    ('perf must be one of', update_entry('marks_panel', perf='huge')),
    ('perf must be one of', drop_entry_field('marks_panel', 'perf')),
    ('context must be one of', update_entry('marks_panel', context='lobby')),
    ('context must be one of', drop_entry_field('marks_panel', 'context')),
    ('not found in assets/', update_preview('sixth_sense', audio='otmetki/none.mp3')),
    ('preview audio must be', update_preview('sixth_sense', audio='../x.mp3')),
    ('unknown component', update_first_conflict(components=['nothing'])),
    ('names our own packages', update_first_conflict(patterns=['net.triotmetki.*'])),
    ('some fixed text', update_first_conflict(patterns=['*'])),
    ('without res/', update_root(ownedPaths=['res/scripts/'])),
)


class CatalogTest(unittest.TestCase):

    def problems(self, mutate):
        raw = copy.deepcopy(load_raw())
        mutate(raw)
        with self.assertRaises(catalog_module.CatalogError) as context:
            catalog_module.parse(raw, ASSETS_DIR)
        return '\n'.join(context.exception.problems)

    def test_repo_catalog_has_the_presets_with_custom_last(self):
        catalog = load_catalog()

        self.assertEqual(catalog.default_preset, 'recommended')
        self.assertEqual([preset.id for preset in catalog.presets], ['recommended', 'minimal', 'streamer', 'custom'])
        self.assertTrue(catalog.presets[-1].custom)

    def test_repo_catalog_requires_core_companion_and_ui(self):
        catalog = load_catalog()

        required = set(entry.id for entry in catalog.components if entry.required)

        self.assertEqual(required, {'core', 'companion', 'ui'})

    def test_every_current_package_is_catalogued(self):
        catalog = load_catalog()

        packages = layout.split_packages('root_init.py')

        missing = [package.key for package in packages if catalog.entry(package.key) is None]
        self.assertEqual(missing, [], 'add these packages to catalog/catalog.json')

    def test_a_bad_catalog_is_rejected_with_the_problem_named(self):
        for expected, mutate in BAD_CATALOGS:
            with self.subTest(expected=expected):
                problems = self.problems(mutate)

                self.assertIn(expected, problems)

    def test_every_component_has_a_perf_and_a_context_mark(self):
        catalog = load_catalog()

        for entry in catalog.components:
            self.assertIn(entry.perf, ('low', 'medium', 'high'), entry.id)
            self.assertIn(entry.context, ('hangar', 'battle', 'any'), entry.id)

    def test_components_with_sounds_have_an_audio_preview(self):
        catalog = load_catalog()

        with_audio = set(entry.id for entry in catalog.components if entry.preview.audio)

        self.assertEqual(with_audio, {'sixth_sense', 'personal_best', 'session_goals'})

    def test_catalog_owns_the_scripts_folder_and_lists_the_xvm_conflict(self):
        catalog = load_catalog()

        self.assertIn('scripts/client/gui/mods/otmetki/', catalog.owned_paths)
        self.assertIn('xvm', [rule.id for rule in catalog.conflicts])


class ManifestTest(unittest.TestCase):

    def setUp(self):
        self.catalog = load_catalog()
        core = fake_package('core')
        companion = fake_package('companion', [core])
        self.packages = [
            core,
            companion,
            fake_package('marks_panel', [core, companion]),
            fake_package('sixth_sense', [core, companion]),
        ]

    def brand_new_package(self):
        core, companion = self.packages[:2]
        return fake_package('brand_new', [core, companion], name='Three Marks: brand new')

    def component(self, component_id):
        manifest, _ = build_manifest(self.packages, self.catalog)
        return manifest.component(component_id)

    def test_components_follow_the_catalog_order(self):
        manifest, _ = build_manifest(self.packages, self.catalog)

        ids = [component.id for component in manifest.components]

        self.assertEqual(ids, ['core', 'companion', 'marks_panel', 'sixth_sense'])

    def test_a_component_takes_file_and_dependencies_from_the_layout(self):
        panel = self.component('marks_panel')

        self.assertEqual(panel.file, 'net.triotmetki.marks_panel_0.1.0.mtmod')
        self.assertEqual(panel.dependencies, ('core', 'companion'))

    def test_a_component_takes_presets_preview_and_title_from_the_catalog(self):
        panel = self.component('marks_panel')

        self.assertEqual(panel.presets, ('recommended', 'minimal', 'streamer'))
        self.assertTrue(panel.default)
        self.assertTrue(panel.catalogued)
        self.assertFalse(panel.required)
        self.assertEqual(panel.preview.image, 'previews/marks_panel.png')
        self.assertEqual(panel.title.ru, 'Отметка в бою')

    def test_a_required_component_is_in_every_preset(self):
        core = self.component('core')

        self.assertTrue(core.required)
        self.assertEqual(core.presets, ('recommended', 'minimal', 'streamer', 'custom'))

    def test_manifest_keeps_only_the_used_categories(self):
        manifest, _ = build_manifest(self.packages, self.catalog)

        self.assertEqual([category.id for category in manifest.categories], ['base', 'battle'])
        self.assertEqual(manifest.extension, 'mtmod')

    def test_a_catalog_entry_without_a_package_is_a_warning(self):
        _, warnings = build_manifest(self.packages, self.catalog)

        self.assertIn('catalog entry ui has no package (not built by this layout)', warnings)

    def test_json_components_are_camel_case(self):
        manifest, _ = build_manifest(self.packages, self.catalog)

        data = manifest.to_json()

        panel = data['components'][2]
        self.assertEqual(data['schemaVersion'], 1)
        self.assertEqual(sorted(panel), sorted(COMPONENT_KEYS))
        self.assertEqual(panel['perf'], 'low')
        self.assertEqual(panel['context'], 'battle')
        self.assertEqual(panel['title'], {'ru': 'Отметка в бою', 'en': 'MoE panel in battle'})
        self.assertEqual(data['components'][3]['preview']['audio'], 'previews/sixth_sense.mp3')

    def test_json_keeps_the_conflicts_and_owned_paths(self):
        manifest, _ = build_manifest(self.packages, self.catalog)

        data = manifest.to_json()

        conflict_ids = [rule['id'] for rule in data['conflicts']]
        self.assertEqual(conflict_ids, ['xvm', 'battle_observer', 'marks_calculator', 'sixth_sense_lamp'])
        self.assertEqual(data['conflicts'][0]['components'], ['sixth_sense'])
        self.assertIn('gui/gameface/mods/triotmetki/', data['ownedPaths'])

    def test_json_serialises(self):
        manifest, _ = build_manifest(self.packages, self.catalog)

        json.dumps(manifest.to_json())

    def test_camel_joins_the_words(self):
        self.assertEqual(camel('fair_play'), 'fairPlay')

    def test_uncatalogued_package_ships_unticked_in_the_fallback_category(self):
        manifest, _ = build_manifest(self.packages + [self.brand_new_package()], self.catalog)

        component = manifest.component('brand_new')

        self.assertEqual(component.category, 'other')
        self.assertFalse(component.default)
        self.assertFalse(component.catalogued)
        self.assertEqual(component.title.ru, 'Three Marks: brand new')
        self.assertEqual(manifest.components[-1].id, 'brand_new')

    def test_uncatalogued_package_is_a_warning(self):
        _, warnings = build_manifest(self.packages + [self.brand_new_package()], self.catalog)

        self.assertTrue([warning for warning in warnings if 'brand_new has no catalog entry' in warning])

    def test_strict_turns_the_uncatalogued_warning_into_an_error(self):
        with self.assertRaises(ManifestError):
            build_manifest(self.packages + [self.brand_new_package()], self.catalog, strict=True)

    def test_a_missing_dependency_fails(self):
        with self.assertRaises(ManifestError) as context:
            build_manifest(self.packages[1:], self.catalog)

        self.assertIn('depends on core', str(context.exception))

    def test_a_foreign_file_name_fails(self):
        foreign = layout.Package('marks_panel', 'com.someone.panel', 'x', '1', 'x', [], [])

        with self.assertRaises(ManifestError) as context:
            build_manifest([foreign], self.catalog)

        self.assertIn('matches no ownedPatterns', str(context.exception))

    def write_packages(self):
        folder = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, folder)
        for package in self.packages:
            with open(os.path.join(folder, archive.file_name(package, 'lesta')), 'wb') as handle:
                handle.write(package.key.encode('ascii'))
        return folder

    def test_built_packages_are_hashed(self):
        folder = self.write_packages()

        manifest, _ = build_manifest(self.packages, self.catalog, packages_dir=folder)

        core = manifest.component('core')
        self.assertEqual(core.sha256, hashlib.sha256(b'core').hexdigest())
        self.assertEqual(core.size, 4)

    def test_a_package_missing_from_the_packages_folder_fails(self):
        folder = self.write_packages()
        os.remove(os.path.join(folder, archive.file_name(self.packages[-1], 'lesta')))

        with self.assertRaises(ManifestError):
            build_manifest(self.packages, self.catalog, packages_dir=folder)

    def test_real_layout_starts_with_core_and_has_every_dependency(self):
        manifest, _ = build_manifest(layout.split_packages('root_init.py'), self.catalog)

        ids = [component.id for component in manifest.components]

        self.assertEqual(ids[:2], ['core', 'companion'])
        for component in manifest.components:
            for dependency in component.dependencies:
                self.assertIn(dependency, ids)


class CliTest(unittest.TestCase):

    def setUp(self):
        self.cli = importlib.import_module('setupkit.__main__')
        self.folder = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.folder)
        with contextlib.redirect_stdout(io.StringIO()):
            self.cli.main(['--out', self.folder, '--skip-artwork'])
        with io.open(os.path.join(self.folder, 'components.json'), encoding='utf-8') as handle:
            self.data = json.load(handle)

    def test_components_json_lists_every_package(self):
        keys = [package.key for package in layout.split_packages('root_init.py')]

        ids = [component['id'] for component in self.data['components'] if 'kind' not in component]

        self.assertEqual(sorted(ids), sorted(keys))

    def test_components_json_lists_the_third_party_dependencies(self):
        components = self.data['components']

        dependencies = [component['id'] for component in components if component.get('kind') == 'dependency']

        self.assertEqual(dependencies, ['openwg_gameface', 'guiflash', 'modslist'])

    def test_audio_previews_are_copied_next_to_components_json(self):
        sixth_sense = next(component for component in self.data['components'] if component['id'] == 'sixth_sense')

        audio = os.path.join(self.folder, *sixth_sense['preview']['audio'].split('/'))

        self.assertTrue(os.path.isfile(audio))

    def test_the_default_output_is_dist_catalog(self):
        self.assertTrue(self.cli.DEFAULT_OUT.endswith(os.path.join('dist', 'catalog')))


if __name__ == '__main__':
    unittest.main()
