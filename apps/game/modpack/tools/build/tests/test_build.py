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
FEATURES = layout.feature_ids()
EXTENSIONS = layout.extension_ids()
UI_ASSETS = layout.GAMEFACE_ROOT + '/ui/'


class LayoutTest(unittest.TestCase):

    def setUp(self):
        self.packages = layout.split_packages('root_init.py')
        self.by_key = dict((package.key, package) for package in self.packages)

    def paths(self, key):
        return [archive_path for _, archive_path in self.by_key[key].files]

    def test_packages_and_ids(self):
        self.assertEqual(sorted(self.by_key), sorted(['companion', 'core'] + EXTENSIONS + FEATURES))
        self.assertEqual(self.by_key['ui'].package_id, 'net.triotmetki.ui')
        for key in ('damage_log', 'hit_log', 'battle_clock', 'team_hp', 'battle_results', 'sixth_sense'):
            self.assertEqual(self.by_key[key].package_id, 'net.triotmetki.' + key)
        self.assertEqual(self.by_key['companion'].package_id, 'otmetki.companion')
        self.assertEqual(self.by_key['core'].package_id, 'net.triotmetki.core')
        self.assertEqual(self.by_key['replay_upload'].package_id, 'net.triotmetki.replay_upload')

    def test_dependencies(self):
        core = self.by_key['core']
        companion = self.by_key['companion']
        self.assertEqual(core.depends, ())
        self.assertEqual(companion.depends, (core,))
        for key in EXTENSIONS + FEATURES:
            self.assertEqual(self.by_key[key].depends, (core, companion))

    def test_no_file_ships_twice(self):
        paths = [archive_path for package in self.packages for _, archive_path in package.files]
        self.assertEqual(len(paths), len(set(paths)))

    def test_in_game_paths(self):
        core = self.paths('core')
        self.assertIn(MODS + 'otmetki/__init__.py', core)
        self.assertIn(MODS + 'otmetki/core/registry/__init__.py', core)
        self.assertIn(MODS + 'otmetki/features/__init__.py', core)
        self.assertIn(MODS + 'otmetki/core/vendor/six.py', core)
        self.assertIn(MODS + 'otmetki/core/vendor/blinker/base.py', core)
        self.assertIn(MODS + 'otmetki/core/vendor/attr/_make.py', core)
        self.assertIn(MODS + 'otmetki/core/vendor/enum34/__init__.py', core)
        self.assertIn(MODS + 'otmetki/core/vendor/licenses/six.txt', core)
        self.assertNotIn(MODS + 'otmetki/core/vendor/attr/_next_gen.py', core)
        companion = self.paths('companion')
        self.assertIn(MODS + 'mod_otmetki.py', companion)
        self.assertIn(MODS + 'otmetki/companion/app/client/__init__.py', companion)
        replay = self.paths('replay_upload')
        self.assertIn(MODS + 'mod_otmetki_replay_upload.py', replay)
        self.assertIn(MODS + 'otmetki/features/replay_upload/model/__init__.py', replay)
        every = [path for package in self.packages for _, path in package.files]
        self.assertFalse([path for path in every if '/tests/' in path or '/entry/' in path])
        entries = [path for path in every if path.startswith(MODS) and '/' not in path[len(MODS):]]
        self.assertEqual(sorted(entries), sorted([MODS + 'mod_otmetki.py'] + [MODS + 'mod_otmetki_%s.py' % key
                                                                             for key in EXTENSIONS + FEATURES]))

    def test_ui_ships_its_gameface_page_and_res_map(self):
        ui = self.paths('ui')
        self.assertIn(MODS + 'mod_otmetki_ui.py', ui)
        self.assertIn(MODS + 'otmetki/ui/bridge/bridge.py', ui)
        for name in ('index.html', 'hud.html', 'icon.png'):
            self.assertIn(UI_ASSETS + name, ui)
        self.assertIn(layout.RES_MAP_ROOT + '/net.triotmetki.ui.json', ui)
        every = [path for package in self.packages for _, path in package.files]
        self.assertEqual([path for path in every if path.startswith(layout.GAMEFACE_ROOT) or path.startswith(layout.RES_MAP_ROOT)],
                         [path for path in ui if not path.endswith('.py')])

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

    def setUp(self):
        self.out = tempfile.mkdtemp()
        self.saved = build.compilers.select
        build.compilers.select = lambda choice, owg=None, python27=None: (None, None)

    def tearDown(self):
        build.compilers.select = self.saved
        shutil.rmtree(self.out)


    def run_build(self, *extra):
        with contextlib.redirect_stdout(io.StringIO()):
            return build.build(build.parse_args(['--out', self.out] + list(extra)))

    def test_split_build(self):
        outputs = self.run_build()
        self.assertEqual(len(outputs), 2 + len(EXTENSIONS) + len(FEATURES))
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
        self.assertEqual([os.path.basename(path) for path in outputs], ['otmetki.%s.wotmod' % layout.modpack_version()])
        with zipfile.ZipFile(outputs[0]) as package:
            self.assertIn(MODS + 'otmetki/core/registry/__init__.py', package.namelist())
            self.assertIn(MODS + 'otmetki/features/session_stats/client/__init__.py', package.namelist())
        with self.assertRaises(SystemExit):
            self.run_build('--require-pyc')

    def test_only_sources_are_compiled(self):
        compiled = []

        def compile_entries(entries, staging):
            compiled.extend(archive_path for _, archive_path in entries)
            return [(source, archive_path + 'c') for source, archive_path in entries]

        build.compilers.select = lambda choice, owg=None, python27=None: ('fake', compile_entries)
        outputs = self.run_build()
        self.assertTrue(compiled and all(path.endswith('.py') for path in compiled))
        with zipfile.ZipFile([path for path in outputs if 'net.triotmetki.ui_' in path][0]) as package:
            names = package.namelist()
            self.assertIn(UI_ASSETS + 'index.html', names)
            self.assertIn(layout.RES_MAP_ROOT + '/net.triotmetki.ui.json', names)
            self.assertIn(MODS + 'mod_otmetki_ui.pyc', names)

    def test_dry_run_writes_nothing(self):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            result = build.build(build.parse_args(['--out', os.path.join(self.out, 'dry'), '--dry-run']))
        self.assertEqual(result, [])
        self.assertFalse(os.path.exists(os.path.join(self.out, 'dry')))
        self.assertIn(UI_ASSETS + 'index.html', output.getvalue())


if __name__ == '__main__':
    unittest.main()
