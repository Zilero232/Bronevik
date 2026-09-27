import os
import sys
import tempfile
import unittest

BUILD_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if BUILD_DIR not in sys.path:
    sys.path.insert(0, BUILD_DIR)

import layout  # noqa: E402
from setupkit import ASSETS_DIR, CATALOG_PATH  # noqa: E402
from setupkit.inno import iscc, render  # noqa: E402
from setupkit.manifest import catalog as catalog_module  # noqa: E402
from setupkit.manifest.generate import build_manifest  # noqa: E402


def packages():
    core = layout.Package('core', 'net.triotmetki.core', 'Core', '0.1.0', 'core', [])
    companion = layout.Package('companion', 'otmetki.companion', 'Companion', '0.2.0', 'companion', [], [core])
    panel = layout.Package('marks_panel', 'net.triotmetki.marks_panel', 'Panel', '0.1.0', 'panel', [], [core, companion])
    upload = layout.Package('replay_upload', 'net.triotmetki.replay_upload', 'Upload', '0.1.0', 'upload', [], [core, companion])
    return [core, companion, panel, upload]


class RenderTest(unittest.TestCase):

    def setUp(self):
        catalog = catalog_module.load(CATALOG_PATH, ASSETS_DIR)
        self.manifest, _ = build_manifest(packages(), catalog)
        self.iss = render.components_iss(self.manifest)
        self.lines = self.iss.splitlines()

    def test_types_are_the_presets(self):
        self.assertIn('Name: "recommended"; Description: "{cm:OtmType_recommended}"', self.lines)
        self.assertIn('Name: "custom"; Description: "{cm:OtmType_custom}"; Flags: iscustom', self.lines)
        types = [line for line in self.lines if line.startswith('Name: ') and 'OtmType_' in line]
        self.assertEqual(types[0], 'Name: "recommended"; Description: "{cm:OtmType_recommended}"')

    def test_component_tree(self):
        self.assertIn('Name: "base\\core"; Description: "{cm:OtmComp_core}"; Types: recommended minimal streamer custom; Flags: fixed', self.lines)
        self.assertIn('Name: "battle\\marks_panel"; Description: "{cm:OtmComp_marks_panel}"; Types: recommended minimal streamer custom', self.lines)
        self.assertIn('Name: "data\\replay_upload"; Description: "{cm:OtmComp_replay_upload}"', self.lines)
        self.assertIn('Name: "battle"; Description: "{cm:OtmCat_battle}"; Types: recommended minimal streamer custom', self.lines)
        self.assertIn('Name: "data"; Description: "{cm:OtmCat_data}"', self.lines)
        self.assertLess(self.lines.index('Name: "base"; Description: "{cm:OtmCat_base}"; Types: recommended minimal streamer custom'),
                        self.lines.index('Name: "battle"; Description: "{cm:OtmCat_battle}"; Types: recommended minimal streamer custom'))

    def test_messages_in_both_languages(self):
        self.assertIn('ru.OtmComp_marks_panel=Отметка в бою', self.lines)
        self.assertIn('en.OtmComp_marks_panel=MoE panel in battle', self.lines)
        self.assertTrue(any(line.startswith('ru.OtmCompFair_marks_panel=') for line in self.lines))
        self.assertTrue(any(line.startswith('en.OtmCatDesc_battle=') for line in self.lines))
        self.assertFalse([line for line in self.lines if '\n' in line])

    def test_catalog_code_follows_the_component_order(self):
        code = self.lines[self.lines.index('procedure OtmCatalogInit;'):]
        adds = [line.strip() for line in code if line.strip().startswith('OtmCatalogAdd(')]
        self.assertEqual(adds[0], "OtmCatalogAdd('base', 'base', True, False, '', '', '', '');")
        self.assertIn("OtmCatalogAdd('battle\\marks_panel', 'marks_panel', False, False, 'net.triotmetki.marks_panel_0.1.0.mtmod', "
                      "'marks_panel.png', '', 'base\\core,base\\companion');", adds)
        self.assertEqual(len(adds), len(self.manifest.categories) + len(self.manifest.components))

    def test_defines_and_section_order(self):
        self.assertEqual(self.lines[0], '#define OtmModpackVersion "0.2.0"')
        self.assertIn('#define OtmOwnedPatterns "net.triotmetki.*.mtmod;net.triotmetki.*.wotmod;otmetki.*.mtmod;otmetki.*.wotmod"', self.lines)
        comment = [index for index, line in enumerate(self.lines) if line.startswith(';')]
        self.assertGreater(comment[0], self.lines.index('[Types]'))

    def test_files(self):
        files = render.files_iss(self.manifest).splitlines()
        self.assertEqual(files[0], '[Files]')
        self.assertIn('Source: "{#OtmPackagesDir}\\otmetki.companion_0.2.0.mtmod"; DestDir: "{code:OtmModsDir}"; Components: base\\companion; '
                      'Flags: ignoreversion', files)
        self.assertIn('Source: "{#OtmBuildDir}\\previews\\marks_panel.png"; Flags: dontcopy', files)

    def test_pascal_quotes(self):
        self.assertEqual(render._pascal("it's"), "'it''s'")
        self.assertEqual(render._message('a\nb'), 'a%nb')


class IsccTest(unittest.TestCase):

    def test_command(self):
        command = iscc.command('ISCC.exe', 'setup.iss', {'B': '2', 'A': 'x y'}, 'out', 'name')
        self.assertEqual(command, ['ISCC.exe', '/Qp', '/DA=x y', '/DB=2', '/Oout', '/Fname', 'setup.iss'])

    def test_find_explicit(self):
        handle, path = tempfile.mkstemp(suffix='.exe')
        os.close(handle)
        self.addCleanup(os.remove, path)
        self.assertEqual(iscc.find_iscc(path), path)


if __name__ == '__main__':
    unittest.main()
