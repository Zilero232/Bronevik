import os
import shutil
import sys
import tempfile
import unittest

PY3 = sys.version_info[0] >= 3
TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if PY3:
    import zipfile  # the portable Python 2.7 of the py27 run ships without it

    if TOOLS_DIR not in sys.path:
        sys.path.insert(0, TOOLS_DIR)
    from most.testing import write_build
    from most.bundle import load_manifest
    from most.package import check_package, parse_meta, read_package


def messages(findings):
    return [item.message for item in findings.items]


@unittest.skipUnless(PY3, 'the MOST bundler needs Python 3')
class PackageTest(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp)

    def build(self, suffix='.pyc'):
        packages = write_build(self.tmp, suffix)
        manifest, _, by_key = load_manifest(self.tmp, packages)
        return manifest, by_key

    def check(self, manifest, by_key, key, release=True):
        component = manifest.component(key)
        info = read_package(os.path.join(self.tmp, component.file))
        pairs = [(depend.package_id, depend.version) for depend in by_key[key].depends]
        return info, check_package(info, component, pairs, release)

    def test_parse_meta_reads_fields_and_dependencies(self):
        meta, dependencies = parse_meta('<root><id>a.b</id><version>1.0.0</version><name>N</name><description>D</description>'
                                        '<dependencies><dependency><id>a.core</id><version>0.1.0</version></dependency></dependencies></root>')
        self.assertEqual(meta, {'id': 'a.b', 'version': '1.0.0', 'name': 'N', 'description': 'D'})
        self.assertEqual(dependencies, [('a.core', '0.1.0')])

    def test_broken_meta_is_a_value_error(self):
        with self.assertRaises(ValueError):
            parse_meta('<root><id>')

    def test_built_release_package_passes(self):
        manifest, by_key = self.build()
        for key in ('core', 'companion', 'marks_panel'):
            info, findings = self.check(manifest, by_key, key)
            self.assertTrue(info.stored)
            self.assertEqual(findings.items, [], messages(findings))

    def test_sources_fail_a_release_and_warn_otherwise(self):
        manifest, by_key = self.build('.py')
        _, release = self.check(manifest, by_key, 'core', release=True)
        _, dev = self.check(manifest, by_key, 'core', release=False)
        self.assertEqual(len(release.errors), 1)
        self.assertIn('.pyc', release.errors[0].message)
        self.assertEqual(dev.errors, [])
        self.assertEqual(len(dev.warnings), 1)

    def test_meta_mismatch_and_wrong_dependencies_are_errors(self):
        manifest, by_key = self.build()
        component = manifest.component('marks_panel')
        path = os.path.join(self.tmp, component.file)
        with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as package:
            package.writestr('meta.xml', '<root><id>net.triotmetki.marks_panel</id><version>9.9.9</version><name>x</name>'
                                         '<description>y</description></root>')
            package.writestr('res/scripts/client/gui/mods/mod_x.pyc', b'')
        info = read_package(path)
        findings = check_package(info, component, [('net.triotmetki.core', '0.1.0')], True)
        errors = ' '.join(item.message for item in findings.errors)
        self.assertIn('version', errors)
        self.assertIn('dependencies', errors)
        self.assertIn('compressed', ' '.join(item.message for item in findings.warnings))

    def test_not_a_zip_or_no_meta(self):
        path = os.path.join(self.tmp, 'bad.mtmod')
        with open(path, 'wb') as handle:
            handle.write(b'not a zip')
        with self.assertRaises(ValueError):
            read_package(path)
        with zipfile.ZipFile(path, 'w') as package:
            package.writestr('res/x.pyc', b'')
        with self.assertRaises(ValueError):
            read_package(path)


if __name__ == '__main__':
    unittest.main()
