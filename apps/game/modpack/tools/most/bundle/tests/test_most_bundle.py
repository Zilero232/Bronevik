import io
import json
import os
import shutil
import sys
import tempfile
import unittest

PY3 = sys.version_info[0] >= 3
TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if PY3:
    if TOOLS_DIR not in sys.path:
        sys.path.insert(0, TOOLS_DIR)
    from most.bundle import BundleError, BundleRequest, assemble
    from most.testing import write_build

CHANGELOG = u'## 0.1.0\n\n- First.\n\n## marks_panel 0.2.0\n\n- Panel.\n'
PANEL_FILES = (
    'net.triotmetki.marks_panel_0.2.0.mtmod',
    'meta.xml',
    'description.ru.md',
    'description.en.md',
    'changelog.md',
    'submission.json',
    os.path.join('screenshots', 'battle.png'),
)


def read_json(path):
    with io.open(path, encoding='utf-8') as handle:
        return json.load(handle)


def read_text(path):
    with io.open(path, encoding='utf-8') as handle:
        return handle.read()


@unittest.skipUnless(PY3, 'the MOST bundler needs Python 3')
class BundleTest(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp)
        self.packages_dir = os.path.join(self.tmp, 'dist')
        os.makedirs(self.packages_dir)
        self.out = os.path.join(self.tmp, 'most')
        self.changelog = os.path.join(self.tmp, 'CHANGELOG.md')
        with io.open(self.changelog, 'w', encoding='utf-8') as handle:
            handle.write(CHANGELOG)
        self.screens = os.path.join(self.tmp, 'screens')
        self.panel_folder = os.path.join(self.out, 'marks_panel')

    def add_screenshot(self):
        os.makedirs(os.path.join(self.screens, 'marks_panel'))
        open(os.path.join(self.screens, 'marks_panel', 'battle.png'), 'wb').close()

    def run_bundle(self, suffix='.pyc', game_version='1.45.0.0', **options):
        packages = write_build(self.packages_dir, suffix)
        options.setdefault('changelog', self.changelog)
        options.setdefault('screenshots_dir', self.screens)
        request = BundleRequest(self.packages_dir, game_version, self.out, packages=packages, **options)
        return assemble(request)

    def test_a_release_bundle_of_a_clean_build_has_no_errors(self):
        self.add_screenshot()

        _, findings = self.run_bundle(release=True)

        self.assertEqual(findings.errors, [], [str(item) for item in findings.errors])

    def test_the_index_lists_every_component_and_the_game_version(self):
        index, _ = self.run_bundle(release=True)

        self.assertEqual([item['id'] for item in index['components']], ['core', 'companion', 'marks_panel'])
        self.assertEqual(read_json(os.path.join(self.out, 'index.json'))['gameVersion'], '1.45.0.0')

    def test_a_component_folder_carries_the_package_texts_and_media(self):
        self.add_screenshot()

        self.run_bundle(release=True)

        for name in PANEL_FILES:
            self.assertTrue(os.path.isfile(os.path.join(self.panel_folder, name)), name)
        self.assertTrue(os.listdir(os.path.join(self.panel_folder, 'previews')))

    def test_the_submission_lists_dependencies_title_and_hash(self):
        self.run_bundle(release=True)

        submission = read_json(os.path.join(self.panel_folder, 'submission.json'))

        self.assertEqual([item['id'] for item in submission['dependencies']], ['core', 'companion'])
        external = [item['id'] for item in submission['externalDependencies']]
        self.assertEqual(external, ['openwg_gameface', 'guiflash'])
        self.assertTrue(submission['forumTitle']['ru'].startswith('[1.45.0.0] '))
        self.assertEqual(len(submission['sha256']), 64)

    def test_the_changelog_carries_the_components_entry(self):
        self.run_bundle(release=True)

        changelog = read_text(os.path.join(self.panel_folder, 'changelog.md'))

        self.assertIn('- Panel.', changelog)

    def test_bad_game_version_and_sources_in_a_release_are_errors(self):
        _, findings = self.run_bundle(suffix='.py', release=True, game_version='1.45', skip_images=True)

        wheres = sorted(set(item.where for item in findings.errors))

        self.assertEqual(wheres, ['bundle', 'companion', 'core', 'marks_panel'])

    def test_only_bundles_the_selected_components(self):
        index, _ = self.run_bundle(only=('marks_panel',), skip_images=True)

        self.assertEqual([item['id'] for item in index['components']], ['marks_panel'])
        self.assertFalse(os.path.isdir(os.path.join(self.out, 'core')))

    def test_only_warns_about_the_dependencies_it_leaves_out(self):
        _, findings = self.run_bundle(only=('marks_panel',), skip_images=True)

        self.assertTrue([item for item in findings.warnings if 'leaves out' in item.message])

    def test_only_with_an_unknown_id_is_a_bundle_error(self):
        with self.assertRaises(BundleError):
            self.run_bundle(only=('nope',))

    def test_missing_package_file_is_a_bundle_error(self):
        packages = write_build(self.packages_dir)
        os.remove(os.path.join(self.packages_dir, 'net.triotmetki.core_0.1.0.mtmod'))

        with self.assertRaises(BundleError):
            assemble(BundleRequest(self.packages_dir, '1.45.0.0', self.out, packages=packages))


if __name__ == '__main__':
    unittest.main()
