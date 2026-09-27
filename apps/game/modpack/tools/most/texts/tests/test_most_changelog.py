# -*- coding: utf-8 -*-
import io
import json
import os
import sys
import unittest

PY3 = sys.version_info[0] >= 3
TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MODPACK_DIR = os.path.dirname(TOOLS_DIR)
CATALOG = os.path.join(MODPACK_DIR, 'installer', 'catalog', 'catalog.json')
PACKAGE_JSON = os.path.join(MODPACK_DIR, 'package.json')
if PY3:
    if TOOLS_DIR not in sys.path:
        sys.path.insert(0, TOOLS_DIR)
    from most import DEFAULT_CHANGELOG, texts
    import layout


def read_json(path):
    with io.open(path, encoding='utf-8') as handle:
        return json.load(handle)


@unittest.skipUnless(PY3, 'the MOST bundler needs Python 3')
class ChangelogTest(unittest.TestCase):

    def setUp(self):
        self.changelog = texts.load_changelog(DEFAULT_CHANGELOG)
        self.versions = dict((package.key, package.version) for package in layout.split_packages('root_init.py'))
        self.catalogued = [item['id'] for item in read_json(CATALOG)['components']]

    def test_every_catalogued_component_has_an_entry_for_its_version(self):
        missing = ['%s %s' % (key, self.versions.get(key)) for key in self.catalogued
                   if not self.changelog.get((key, self.versions.get(key)))]
        self.assertEqual(missing, [])

    def test_entries_name_only_known_components(self):
        unknown = sorted('%s %s' % key for key in self.changelog if key[0] is not None and key[0] not in self.versions)
        self.assertEqual(unknown, [])

    def test_release_entry_for_the_modpack_version(self):
        self.assertTrue(self.changelog.get((None, read_json(PACKAGE_JSON)['version'])))

    def test_every_package_is_catalogued(self):
        self.assertEqual(sorted(self.versions), sorted(self.catalogued))
