import configparser
import io
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile

UNITS_DIR = os.path.dirname(os.path.abspath(__file__))
MODPACK_DIR = os.path.dirname(os.path.dirname(os.path.dirname(UNITS_DIR)))
BUILD_DIR = os.path.join(MODPACK_DIR, 'tools', 'build')
if BUILD_DIR not in sys.path:
    sys.path.insert(0, BUILD_DIR)

from setupkit.inno import iscc, render  # noqa: E402
from setupkit.manifest.model import Category, Component, Localized, Manifest, Preset, Preview  # noqa: E402

OWNED = ('net.triotmetki.*.mtmod', 'otmetki.*.mtmod')
APP_TYPE = '<protocol name="app_type" version="1.0"><app_type>sd</app_type></protocol>\n'


def text(value):
    return Localized(value, value)


def component(component_id, category, dependencies=(), required=False):
    return Component(
        id=component_id, package_id='net.triotmetki.' + component_id, version='0.1.0',
        file='net.triotmetki.%s_0.1.0.mtmod' % component_id, category=category, title=text(component_id),
        description=text(component_id), fair_play=text('own data'), required=required, default=True,
        presets=('recommended',), preview=Preview(), dependencies=tuple(dependencies), catalogued=True)


MANIFEST = Manifest(
    modpack_version='0.1.0', platform='lesta', extension='mtmod',
    categories=(Category('base', text('Base'), text('Base')), Category('battle', text('Battle'), text('Battle'))),
    presets=(Preset('recommended', text('Recommended'), text('r')), Preset('custom', text('Custom'), text('c'), custom=True)),
    components=(
        component('core', 'base', required=True),
        component('companion', 'base', ('core',), required=True),
        component('panel', 'battle', ('core', 'companion')),
        component('log', 'battle', ('core', 'companion', 'panel')),
        component('clock', 'battle', ('core', 'companion')),
    ),
    owned_patterns=OWNED,
)


def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with io.open(path, 'w', encoding='utf-8') as handle:
        handle.write(content)


def make_client(root, realm='RU', version='1.45.0.0', exe='Tanki.exe', mods_in_paths=True, suffix=''):
    write(os.path.join(root, 'app_type.xml'), APP_TYPE)
    write(os.path.join(root, 'version.xml'),
          '<version.xml><version> v.%s%s #5231</version><meta><realm>%s</realm></meta></version.xml>\n' % (version, suffix, realm))
    paths = ['<Path>./res_mods/%s</Path>' % version]
    if mods_in_paths:
        paths.append('<Path>./mods/%s</Path>' % version)
    write(os.path.join(root, 'paths.xml'), '<root><Paths>%s<Packages><Package>./res/packages/gui.pkg</Package></Packages></Paths></root>\n'
          % ''.join(paths))
    write(os.path.join(root, exe), 'MZ')
    write(os.path.join(root, 'win64', exe), 'MZ')
    write(os.path.join(root, 'game_info.xml'), '<protocol><game><id>%s.PRODUCTION</id></game></protocol>\n' % ('MT.RPT' if realm == 'RPT' else 'MT.RU'))
    return root


def openwg_dir():
    from setupkit.openwg.fetch import fetch
    target = os.path.join(MODPACK_DIR, '.cache', 'openwg-files')
    try:
        return fetch(target, os.path.join(MODPACK_DIR, '.cache', 'openwg'))
    except Exception as error:
        raise unittest.SkipTest('OpenWG.Utils not available: %s' % error)


class Harness(object):

    def __init__(self, work):
        self.work = work
        self.counter = 0

    def run(self, sections, state_root):
        self.counter += 1
        cases = os.path.join(self.work, 'cases%d.ini' % self.counter)
        out = os.path.join(self.work, 'out%d.ini' % self.counter)
        parser = configparser.ConfigParser(interpolation=None)
        parser.optionxform = str
        for name, values in sections.items():
            parser[name] = dict((key, str(value)) for key, value in values.items())
        buffer = io.StringIO()
        parser.write(buffer)
        with io.open(cases, 'w', encoding='utf-16') as handle:
            handle.write(buffer.getvalue())
        with io.open(out, 'w', encoding='utf-16') as handle:
            handle.write('')
        subprocess.run([self.exe, '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART', '/CASES=' + cases, '/OUT=' + out,
                        '/STATEROOT=' + state_root, '/LOGSDIR=' + os.path.join(state_root, 'logs')], timeout=120)
        result = configparser.ConfigParser(interpolation=None)
        result.optionxform = str
        with io.open(out, encoding='utf-16') as handle:
            result.read_file(handle)
        if result.get('done', 'ok', fallback='') != '1':
            raise AssertionError('harness failed: %s' % result.get('done', 'error', fallback='no result'))
        return result


class InstallerUnitsTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        compiler = iscc.find_iscc()
        if compiler is None:
            raise unittest.SkipTest('ISCC.exe (Inno Setup 6.7) not found; set $ISCC')
        cls.tmp = tempfile.mkdtemp(prefix='otm-units-')
        build = os.path.join(cls.tmp, 'build')
        shutil.copytree(openwg_dir(), os.path.join(build, 'openwg'))
        write(os.path.join(build, 'components.iss'), render.components_iss(MANIFEST))
        output = subprocess.run(iscc.command(compiler, os.path.join(UNITS_DIR, 'harness.iss'), {'OtmBuildDir': build}, cls.tmp, 'otm-units'),
                                capture_output=True, text=True, errors='replace')
        if output.returncode != 0:
            raise AssertionError('harness.iss does not compile:\n' + output.stdout + output.stderr)
        cls.harness = Harness(cls.tmp)
        cls.harness.exe = os.path.join(cls.tmp, 'otm-units.exe')

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    def setUp(self):
        self.case = tempfile.mkdtemp(prefix='case-', dir=self.tmp)
        self.state_root = os.path.join(self.case, 'state')

    def run_harness(self, sections):
        return self.harness.run(sections, self.state_root)

    def test_supported_versions(self):
        versions = ['1.45.0.0', '1.35.0.0', '1.34.1.0', '2.0.0.0', '0.9.22', '', 'garbage']
        result = self.run_harness({'versions': dict([('count', len(versions))] + [(str(i), v) for i, v in enumerate(versions)])})
        self.assertEqual([result.get('versions', str(i)) for i in range(len(versions))], ['1', '1', '0', '0', '0', '0', '0'])

    def test_client_detection(self):
        clients = [
            make_client(os.path.join(self.case, 'Tanki')),
            make_client(os.path.join(self.case, 'Tanki_CT'), realm='RPT', version='1.46.0.0', suffix=' Common Test'),
            make_client(os.path.join(self.case, 'Игры', 'Мир танков')),
            make_client(os.path.join(self.case, 'NoModsPath'), mods_in_paths=False),
            make_client(os.path.join(self.case, 'WoT'), realm='EU', version='2.0.0.0', exe='WorldOfTanks.exe'),
            make_client(os.path.join(self.case, 'Old'), version='1.30.0.0', exe='WorldOfTanks.exe'),
            os.path.join(self.case, 'Empty'),
        ]
        os.makedirs(clients[-1])
        sections = {'clients': dict([('count', len(clients))] + [(str(i), path) for i, path in enumerate(clients)])}
        result = self.run_harness(sections)

        def client(index):
            return dict(result.items('client.%d' % index))

        release = client(0)
        self.assertEqual(release['added'], '1')
        self.assertEqual(release['version'], '1.45.0.0')
        self.assertEqual(release['problem'], '')
        self.assertEqual(os.path.normcase(release['mods']), os.path.normcase(os.path.join(clients[0], 'mods', '1.45.0.0')))
        self.assertEqual(os.path.normcase(release['res_mods']), os.path.normcase(os.path.join(clients[0], 'res_mods', '1.45.0.0')))
        test_server = client(1)
        self.assertEqual((test_server['problem'], test_server['branch']), ('', '2'))
        cyrillic = client(2)
        self.assertEqual((cyrillic['added'], cyrillic['problem']), ('1', ''))
        self.assertEqual(os.path.normcase(cyrillic['path']), os.path.normcase(clients[2]))
        fallback = client(3)
        self.assertEqual(os.path.normcase(fallback['mods']), os.path.normcase(os.path.join(clients[3], 'mods', '1.45.0.0')))
        self.assertEqual(client(4)['problem'], 'OtmClientNotLesta')
        self.assertEqual(client(5)['problem'], 'OtmClientOldVersion')
        self.assertEqual(client(6)['added'], '0')

    def test_dependency_closure(self):
        deps = {
            'count': 4,
            '0.select': 'battle\\log',
            '1.select': 'battle\\clock',
            '2.select': 'base\\core,base\\companion,battle\\panel,battle\\log,battle\\clock',
            '2.remove': 'battle\\panel',
            '3.select': 'base\\core,base\\companion,battle\\clock',
            '3.remove': 'base\\core',
        }
        result = self.run_harness({'deps': deps})

        def names(key):
            return sorted(result.get('deps', key).split(','))

        self.assertEqual(names('0'), ['base\\companion', 'base\\core', 'battle\\log', 'battle\\panel'])
        self.assertEqual(names('1'), ['base\\companion', 'base\\core', 'battle\\clock'])
        self.assertEqual(names('2'), ['base\\companion', 'base\\core', 'battle\\clock'])
        self.assertEqual(names('3'), ['base\\companion', 'base\\core', 'battle\\clock'])

    def state(self, action, **extra):
        game = os.path.join(self.case, 'game')
        values = {'action': action, 'path': game, 'version': '1.45.0.0',
                  'mods': os.path.join(game, 'mods', '1.45.0.0'), 'res_mods': os.path.join(game, 'res_mods', '1.45.0.0')}
        values.update(extra)
        return dict(self.run_harness({'state': values}).items('state')), game

    def test_install_cleans_only_our_files(self):
        game = os.path.join(self.case, 'game')
        mods = os.path.join(game, 'mods', '1.45.0.0')
        write(os.path.join(mods, 'net.triotmetki.old_feature_0.0.9.mtmod'), 'old')
        write(os.path.join(mods, 'otmetki.0.0.9.mtmod'), 'old single')
        write(os.path.join(mods, 'me.poliroid.modslist_1.0.mtmod'), 'theirs')
        write(os.path.join(game, 'res_mods', '1.45.0.0', 'gui', 'x.xml'), 'theirs')
        result, _ = self.state('install', components='base\\core,battle\\panel')
        self.assertEqual(sorted(os.listdir(mods)), ['me.poliroid.modslist_1.0.mtmod'])
        manifest = configparser.ConfigParser(interpolation=None)
        with io.open(result['manifest'], encoding='utf-16') as handle:
            manifest.read_file(handle)
        self.assertEqual(manifest.get('files', 'count'), '3')
        files = sorted(os.path.basename(manifest.get('files', str(i))) for i in range(3))
        self.assertEqual(files, ['net.triotmetki.companion_0.1.0.mtmod', 'net.triotmetki.core_0.1.0.mtmod', 'net.triotmetki.panel_0.1.0.mtmod'])
        others, _ = self.state('others')
        self.assertEqual(sorted(os.path.basename(path) for path in others['others'].split('|')), ['gui', 'me.poliroid.modslist_1.0.mtmod'])

    def test_manifest_files_are_removed_on_cleanup(self):
        game = os.path.join(self.case, 'game')
        mods = os.path.join(game, 'mods', '1.45.0.0')
        self.state('install', components='battle\\clock')
        for name in ('net.triotmetki.core_0.1.0.mtmod', 'net.triotmetki.clock_0.1.0.mtmod', 'mod_by_someone_else.mtmod'):
            write(os.path.join(mods, name), 'x')
        self.state('cleanup')
        self.assertEqual(os.listdir(mods), ['mod_by_someone_else.mtmod'])

    def test_snapshot_restore_and_prune(self):
        game = os.path.join(self.case, 'game')
        mods = os.path.join(game, 'mods', '1.45.0.0')
        configs = os.path.join(game, 'mods', 'configs', 'otmetki')
        write(os.path.join(mods, 'theirs.mtmod'), 'v1')
        write(os.path.join(configs, 'config.json'), '{"enabled": true}')
        snapshot, _ = self.state('snapshot')
        self.assertRegex(snapshot['snapshot'], r'^\d{8}-\d{6}$')
        write(os.path.join(mods, 'theirs.mtmod'), 'v2')
        write(os.path.join(mods, 'added_later.mtmod'), 'new')
        shutil.rmtree(configs)
        write(os.path.join(game, 'res_mods', '1.45.0.0', 'created.xml'), 'new')
        restored, _ = self.state('restore')
        self.assertEqual(restored['restored'], '1')
        self.assertEqual(sorted(os.listdir(mods)), ['theirs.mtmod'])
        with io.open(os.path.join(mods, 'theirs.mtmod'), encoding='utf-8') as handle:
            self.assertEqual(handle.read(), 'v1')
        self.assertTrue(os.path.isfile(os.path.join(configs, 'config.json')))
        self.assertFalse(os.path.exists(os.path.join(game, 'res_mods', '1.45.0.0')))
        backups = os.path.dirname(os.path.dirname(self.find_snapshot_ini()))
        for name in ('20200101-000000', '20200102-000000', '20200103-000000'):
            write(os.path.join(backups, name, 'snapshot.ini'), '[snapshot]\n')
        pruned, _ = self.state('prune')
        self.assertEqual(pruned['left'].split(','), ['20200102-000000', '20200103-000000', snapshot['snapshot']])

    def test_logs_bundle_leaves_the_secret_out(self):
        game = os.path.join(self.case, 'game')
        configs = os.path.join(game, 'mods', 'configs', 'otmetki')
        write(os.path.join(game, 'python.log'), '[OTMETKI] started')
        write(os.path.join(configs, 'config.json'), '{}')
        write(os.path.join(configs, 'credentials.json'), '{"secret": "x"}')
        write(os.path.join(game, 'mods', '1.45.0.0', 'theirs.mtmod'), 'x')
        self.state('install', components='battle\\clock')
        os.makedirs(os.path.join(self.state_root, 'logs'))
        result, _ = self.state('logs')
        self.assertTrue(result['zip'].endswith('.zip'), result)
        with zipfile.ZipFile(result['zip']) as bundle:
            names = sorted(name.lstrip('./') for name in bundle.namelist() if not name.endswith('/'))
        self.assertIn('game/python.log', names)
        self.assertIn('game/config.json', names)
        self.assertIn('game/folders.txt', names)
        self.assertIn('state/manifest.ini', names)
        self.assertIn('about.txt', names)
        self.assertFalse([name for name in names if 'credentials' in name])

    def find_snapshot_ini(self):
        for directory, _, files in os.walk(self.state_root):
            if 'snapshot.ini' in files:
                return os.path.join(directory, 'snapshot.ini')
        self.fail('no snapshot.ini under %s' % self.state_root)


if __name__ == '__main__':
    unittest.main()
