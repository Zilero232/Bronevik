"""End to end: build the real installer, install silently into a fixture client, then uninstall.

Opt-in (OTMETKI_INSTALLER_E2E=1): a real install registers the uninstaller for the current user
(HKCU ...\\Uninstall), which the uninstall step removes again. CI runs it in the release job on a
throwaway Windows runner. Needs ISCC, resvg-py + pillow (artwork) and the OpenWG.Utils release.
"""
import configparser
import io
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import unittest

E2E_DIR = os.path.dirname(os.path.abspath(__file__))
INSTALLER_DIR = os.path.dirname(os.path.dirname(E2E_DIR))
MODPACK_DIR = os.path.dirname(INSTALLER_DIR)
BUILD_DIR = os.path.join(MODPACK_DIR, 'tools', 'build')
if BUILD_DIR not in sys.path:
    sys.path.insert(0, BUILD_DIR)
sys.path.insert(0, os.path.join(INSTALLER_DIR, 'tests', 'units'))

from setupkit.inno import iscc  # noqa: E402
from test_units import make_client, write  # noqa: E402

THEIRS = 'me.poliroid.modslist_1.0.mtmod'


@unittest.skipUnless(os.environ.get('OTMETKI_INSTALLER_E2E') == '1', 'set OTMETKI_INSTALLER_E2E=1 to install for real')
class SilentInstallTest(unittest.TestCase):

    def setUp(self):
        compiler = iscc.find_iscc()
        if compiler is None:
            self.skipTest('ISCC.exe (Inno Setup 6.7) not found')
        self.tmp = tempfile.mkdtemp(prefix='otm-e2e-')
        self.addCleanup(shutil.rmtree, self.tmp, True)
        packages = os.path.join(self.tmp, 'packages')
        out = os.path.join(self.tmp, 'out')
        subprocess.run([sys.executable, os.path.join(BUILD_DIR, 'build.py'), '--out', packages], check=True, capture_output=True)
        subprocess.run([sys.executable, os.path.join(BUILD_DIR, 'setupkit'), '--packages', packages, '--out', out, '--compile',
                        '--iscc', compiler, '--version', '0.0.0-e2e'], check=True)
        self.setup_exe = os.path.join(out, 'otmetki-setup-0.0.0-e2e.exe')
        with io.open(os.path.join(out, 'components.json'), encoding='utf-8') as handle:
            self.manifest = json.load(handle)
        self.game = make_client(os.path.join(self.tmp, 'Игры', 'Tanki'))
        self.mods = os.path.join(self.game, 'mods', '1.45.0.0')
        write(os.path.join(self.mods, THEIRS), 'theirs')
        write(os.path.join(self.mods, 'net.triotmetki.old_0.0.1.mtmod'), 'ours, old')
        self.app = os.path.join(self.tmp, 'app')
        self.state = os.path.join(self.tmp, 'state')

    def wait_for(self, condition, seconds=90):
        deadline = time.time() + seconds
        while time.time() < deadline:
            if condition():
                return True
            time.sleep(1)
        return False

    def test_install_then_uninstall(self):
        log = os.path.join(self.tmp, 'setup.log')
        subprocess.run([self.setup_exe, '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART', '/LANG=en', '/DIR=' + self.app,
                        '/GAMEDIR=' + self.game, '/STATEROOT=' + self.state, '/LOG=' + log], timeout=300, check=True)
        expected = sorted(component['file'] for component in self.manifest['components'] if component['default'])
        installed = sorted(name for name in os.listdir(self.mods) if name != THEIRS)
        self.assertEqual(installed, expected)
        self.assertIn(THEIRS, os.listdir(self.mods))

        states = os.listdir(os.path.join(self.state, 'clients'))
        self.assertEqual(len(states), 1)
        client_state = os.path.join(self.state, 'clients', states[0])
        manifest = configparser.ConfigParser(interpolation=None)
        with io.open(os.path.join(client_state, 'manifest.ini'), encoding='utf-16') as handle:
            manifest.read_file(handle)
        self.assertEqual(int(manifest.get('files', 'count')), len(expected))
        self.assertEqual(len(os.listdir(os.path.join(client_state, 'backups'))), 1)

        uninstaller = os.path.join(self.app, 'uninstall', 'unins000.exe')
        self.assertTrue(os.path.isfile(uninstaller))
        subprocess.run([uninstaller, '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART', '/STATEROOT=' + self.state], timeout=300)
        self.assertTrue(self.wait_for(lambda: not os.path.exists(uninstaller)), 'the uninstaller did not finish')
        self.assertTrue(self.wait_for(lambda: os.listdir(self.mods) == [THEIRS]), os.listdir(self.mods))
        self.assertFalse(os.path.exists(os.path.join(self.state, 'clients')))


if __name__ == '__main__':
    unittest.main()
