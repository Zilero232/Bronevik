import contextlib
import io
import os
import shutil
import sys
import tempfile
import unittest
import zipfile

import _support  # noqa: F401

BUILD_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BUILD_DIR not in sys.path:
    sys.path.insert(0, BUILD_DIR)

import archive  # noqa: E402
import build  # noqa: E402
import layout  # noqa: E402

MODS = layout.MODS_ROOT + '/'


class LayoutTest(unittest.TestCase):

    def setUp(self):
        self.packages = layout.split_packages('root_init.py')
        self.by_key = dict((package.key, package) for package in self.packages)

    def paths(self, key):
        return [archive_path for _, archive_path in self.by_key[key].files]

    def test_packages_and_ids(self):
        self.assertEqual(sorted(self.by_key), ['companion', 'core', 'marks_panel', 'replay_upload', 'session_stats'])
        self.assertEqual(self.by_key['companion'].package_id, 'otmetki.companion')
        self.assertEqual(self.by_key['core'].package_id, 'net.triotmetki.core')
        self.assertEqual(self.by_key['replay_upload'].package_id, 'net.triotmetki.replay_upload')

    def test_dependencies(self):
        core = self.by_key['core']
        companion = self.by_key['companion']
        self.assertEqual(core.depends, ())
        self.assertEqual(companion.depends, (core,))
        for key in ('marks_panel', 'session_stats', 'replay_upload'):
            self.assertEqual(self.by_key[key].depends, (core, companion))

    def test_no_file_ships_twice(self):
        paths = [archive_path for package in self.packages for _, archive_path in package.files]
        self.assertEqual(len(paths), len(set(paths)))

    def test_in_game_paths(self):
        core = self.paths('core')
        self.assertIn(MODS + 'otmetki/__init__.py', core)
        self.assertIn(MODS + 'otmetki/core/registry.py', core)
        self.assertIn(MODS + 'otmetki/features/__init__.py', core)
        companion = self.paths('companion')
        self.assertIn(MODS + 'mod_otmetki.py', companion)
        self.assertIn(MODS + 'otmetki/companion/client/app.py', companion)
        replay = self.paths('replay_upload')
        self.assertIn(MODS + 'mod_otmetki_replay_upload.py', replay)
        self.assertIn(MODS + 'otmetki/features/replay_upload/model.py', replay)
        every = [path for package in self.packages for _, path in package.files]
        self.assertFalse([path for path in every if '/tests/' in path or '/entry/' in path])
        entries = [path for path in every if path.startswith(MODS) and '/' not in path[len(MODS):]]
        self.assertEqual(sorted(entries), sorted([MODS + 'mod_otmetki.py'] + [MODS + 'mod_otmetki_%s.py' % key
                                                                             for key in ('marks_panel', 'replay_upload', 'session_stats')]))

    def test_single_package_is_the_union(self):
        single = layout.single_package('root_init.py')
        self.assertEqual(single.package_id, 'otmetki.companion')
        self.assertEqual(single.depends, ())
        self.assertEqual(sorted(path for _, path in single.files), sorted(path for package in self.packages for _, path in package.files))

    def test_meta_and_names(self):
        meta = archive.meta_xml(self.by_key['marks_panel'])
        self.assertIn('<id>net.triotmetki.marks_panel</id>', meta)
        self.assertIn('<dependency>\n            <id>net.triotmetki.core</id>', meta)
        self.assertIn('<id>otmetki.companion</id>', meta)
        self.assertNotIn('<dependencies>', archive.meta_xml(self.by_key['core']))
        companion = self.by_key['companion']
        self.assertEqual(archive.file_name(companion, 'lesta'), 'otmetki.companion_%s.mtmod' % companion.version)
        self.assertEqual(archive.file_name(companion, 'wg', single=True), 'otmetki.%s.wotmod' % companion.version)


class BuildTest(unittest.TestCase):
    """A source-only build (no compiler): the development format, checked for the package layout."""

    def setUp(self):
        self.out = tempfile.mkdtemp()
        self.saved = build.compilers.select
        build.compilers.select = lambda choice, owg=None, python27=None: (None, None)

    def tearDown(self):
        build.compilers.select = self.saved
        shutil.rmtree(self.out)

    def companion_version(self):
        return layout.read_constants(os.path.join(layout.PACKAGES_DIR, 'companion', 'version.py'), ('VERSION',))[0]

    def run_build(self, *extra):
        with contextlib.redirect_stdout(io.StringIO()):
            return build.build(build.parse_args(['--out', self.out] + list(extra)))

    def test_split_build(self):
        outputs = self.run_build()
        self.assertEqual(len(outputs), 5)
        self.assertTrue(all(path.endswith('.mtmod') for path in outputs))
        with zipfile.ZipFile([path for path in outputs if 'otmetki.companion_' in path][0]) as package:
            names = package.namelist()
            self.assertEqual(names[0], 'meta.xml')
            self.assertIn('res/scripts/client/gui/mods/', names)
            self.assertIn(MODS + 'mod_otmetki.py', names)
            self.assertTrue(all(info.compress_type == zipfile.ZIP_STORED for info in package.infolist()))
            self.assertIn(b'<id>net.triotmetki.core</id>', package.read('meta.xml'))

    def test_single_build_and_require_pyc(self):
        outputs = self.run_build('--single', '--wg')
        self.assertEqual([os.path.basename(path) for path in outputs], ['otmetki.%s.wotmod' % self.companion_version()])
        with zipfile.ZipFile(outputs[0]) as package:
            self.assertIn(MODS + 'otmetki/core/registry.py', package.namelist())
            self.assertIn(MODS + 'otmetki/features/session_stats/client.py', package.namelist())
        with self.assertRaises(SystemExit):
            self.run_build('--require-pyc')


if __name__ == '__main__':
    unittest.main()
