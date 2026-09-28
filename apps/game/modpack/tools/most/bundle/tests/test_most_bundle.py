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
    from most.bundle import BundleError, assemble
    from most.testing import write_build


def read_json(path):
    with io.open(path, encoding='utf-8') as handle:
        return json.load(handle)


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
            handle.write(u'## 0.1.0\n\n- First.\n\n## marks_panel 0.2.0\n\n- Panel.\n')
        self.screens = os.path.join(self.tmp, 'screens')

    def run_bundle(self, suffix='.pyc', **options):
        packages = write_build(self.packages_dir, suffix)
        options.setdefault('changelog', self.changelog)
        options.setdefault('screenshots_dir', self.screens)
        return assemble(self.packages_dir, options.pop('game_version', '1.45.0.0'), self.out, packages=packages, **options)

    def test_writes_a_folder_per_component_and_an_index(self):
        os.makedirs(os.path.join(self.screens, 'marks_panel'))
        open(os.path.join(self.screens, 'marks_panel', 'battle.png'), 'wb').close()
        index, findings = self.run_bundle(release=True)
        self.assertEqual(findings.errors, [], [str(item) for item in findings.errors])
        self.assertEqual([item['id'] for item in index['components']], ['core', 'companion', 'marks_panel'])
        self.assertEqual(read_json(os.path.join(self.out, 'index.json'))['gameVersion'], '1.45.0.0')
        folder = os.path.join(self.out, 'marks_panel')
        for name in ('net.triotmetki.marks_panel_0.2.0.mtmod', 'meta.xml', 'description.ru.md', 'description.en.md',
                     'changelog.md', 'submission.json', os.path.join('screenshots', 'battle.png')):
            self.assertTrue(os.path.isfile(os.path.join(folder, name)), name)
        self.assertTrue(os.listdir(os.path.join(folder, 'previews')))
        submission = read_json(os.path.join(folder, 'submission.json'))
        self.assertEqual([item['id'] for item in submission['dependencies']], ['core', 'companion'])
        self.assertEqual([item['id'] for item in submission['externalDependencies']], ['openwg_gameface', 'guiflash'])
        self.assertTrue(submission['forumTitle']['ru'].startswith('[1.45.0.0] '))
        self.assertEqual(len(submission['sha256']), 64)
        with io.open(os.path.join(folder, 'changelog.md'), encoding='utf-8') as handle:
            self.assertIn('- Panel.', handle.read())

    def test_bad_game_version_and_sources_in_a_release_are_errors(self):
        _, findings = self.run_bundle(suffix='.py', release=True, game_version='1.45', skip_images=True)
        wheres = sorted(set(item.where for item in findings.errors))
        self.assertEqual(wheres, ['bundle', 'companion', 'core', 'marks_panel'])

    def test_only_selects_components_and_flags_missing_dependencies(self):
        index, findings = self.run_bundle(only=('marks_panel',), skip_images=True)
        self.assertEqual([item['id'] for item in index['components']], ['marks_panel'])
        self.assertTrue(any('leaves out' in item.message for item in findings.warnings))
        self.assertFalse(os.path.isdir(os.path.join(self.out, 'core')))
        with self.assertRaises(BundleError):
            self.run_bundle(only=('nope',))

    def test_missing_package_file_is_a_bundle_error(self):
        packages = write_build(self.packages_dir)
        os.remove(os.path.join(self.packages_dir, 'net.triotmetki.core_0.1.0.mtmod'))
        with self.assertRaises(BundleError):
            assemble(self.packages_dir, '1.45.0.0', self.out, packages=packages)


if __name__ == '__main__':
    unittest.main()
