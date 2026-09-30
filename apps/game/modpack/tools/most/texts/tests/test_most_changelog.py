# -*- coding: utf-8 -*-
import io
import json
import os
import re
import sys
import unittest

PY3 = sys.version_info[0] >= 3
TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MODPACK_DIR = os.path.dirname(TOOLS_DIR)
CATALOG = os.path.join(MODPACK_DIR, 'catalog', 'catalog.json')
PACKAGE_JSON = os.path.join(MODPACK_DIR, 'package.json')
CYRILLIC = re.compile(u'[Ѐ-ӿ]')
if PY3:
    if TOOLS_DIR not in sys.path:
        sys.path.insert(0, TOOLS_DIR)
    from most import DEFAULT_CHANGELOG, texts
    import layout


def read_json(path):
    with io.open(path, encoding='utf-8') as handle:
        return json.load(handle)


def entry_name(key):
    component_id, version = key
    return '%s %s' % (component_id or 'modpack', version)


def is_translated(entry):
    russian = entry.get('ru', '')
    return russian != entry.get('en') and bool(CYRILLIC.search(russian))


@unittest.skipUnless(PY3, 'the MOST bundler needs Python 3')
class ChangelogTest(unittest.TestCase):

    def setUp(self):
        self.changelog = texts.load_changelog(DEFAULT_CHANGELOG)
        self.versions = dict((package.key, package.version) for package in layout.split_packages('root_init.py'))
        self.catalogued = [item['id'] for item in read_json(CATALOG)['components'] if 'kind' not in item]

    def test_every_catalogued_component_has_an_entry_for_its_version(self):
        keys = [(component_id, self.versions.get(component_id)) for component_id in self.catalogued]

        missing = ['%s %s' % key for key in keys if not self.changelog.get(key)]

        self.assertEqual(missing, [])

    def test_entries_name_only_known_components(self):
        component_keys = [key for key in self.changelog if key[0] is not None]

        unknown = sorted('%s %s' % key for key in component_keys if key[0] not in self.versions)

        self.assertEqual(unknown, [])

    def test_release_entry_for_the_modpack_version(self):
        version = read_json(PACKAGE_JSON)['version']

        self.assertTrue(self.changelog.get((None, version)))

    def test_every_entry_is_bilingual(self):
        languages = sorted(texts.LANGUAGES)

        incomplete = sorted(entry_name(key) for key, entry in self.changelog.items() if sorted(entry) != languages)

        self.assertEqual(incomplete, [])

    def test_russian_texts_are_translations(self):
        untranslated = sorted(entry_name(key) for key, entry in self.changelog.items() if not is_translated(entry))

        self.assertEqual(untranslated, [])

    def test_every_package_is_catalogued(self):
        self.assertEqual(sorted(self.versions), sorted(self.catalogued))
