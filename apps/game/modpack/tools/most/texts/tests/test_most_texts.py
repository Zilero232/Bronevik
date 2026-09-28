# -*- coding: utf-8 -*-
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
    from most import texts
    from most.bundle import load_manifest
    from most.testing import write_build

CHANGELOG = u"""# Changelog

## marks_panel 0.2.0

### ru

- Крупнее шрифт.

### en

- Bigger font.

## core 0.3.0

### en

- English only.

## 0.1.0

- First release.

## 0.0.9

- Old.
"""
FIRST = {'ru': '- First release.', 'en': '- First release.'}


@unittest.skipUnless(PY3, 'the MOST bundler needs Python 3')
class TextsTest(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp)
        self.manifest, _, _ = load_manifest(self.tmp, write_build(self.tmp))

    def test_changelog_entries_by_component_then_version(self):
        changelog = texts.parse_changelog(CHANGELOG)
        self.assertEqual(changelog[('marks_panel', '0.2.0')], {'ru': u'- Крупнее шрифт.', 'en': '- Bigger font.'})
        self.assertEqual(texts.changelog_entry(changelog, self.manifest.component('marks_panel')), changelog[('marks_panel', '0.2.0')])
        self.assertEqual(texts.changelog_entry(changelog, self.manifest.component('core')), FIRST)
        self.assertIsNone(texts.changelog_entry({}, self.manifest.component('core')))

    def test_an_entry_without_language_sections_serves_both_languages(self):
        entry = texts.parse_changelog(CHANGELOG)[(None, '0.1.0')]
        self.assertEqual(sorted(entry), sorted(texts.LANGUAGES))
        self.assertEqual(len(set(entry.values())), 1)

    def test_ru_text_is_preferred_and_falls_back_to_en(self):
        changelog = texts.parse_changelog(CHANGELOG)
        bilingual = changelog[('marks_panel', '0.2.0')]
        english_only = changelog[('core', '0.3.0')]
        self.assertEqual(texts.changes_text(bilingual, 'ru'), bilingual['ru'])
        self.assertEqual(texts.changes_text(bilingual, 'en'), bilingual['en'])
        self.assertEqual(texts.changes_text(english_only, 'ru'), english_only['en'])
        self.assertIsNone(texts.changes_text(None, 'ru'))

    def test_description_takes_the_changes_in_its_language(self):
        panel = self.manifest.component('marks_panel')
        changes = texts.parse_changelog(CHANGELOG)[('marks_panel', '0.2.0')]
        russian = texts.description(panel, self.manifest, 'ru', '1.45.0.0', changes)
        english = texts.description(panel, self.manifest, 'en', '1.45.0.0', changes)
        self.assertIn(changes['ru'], russian)
        self.assertNotIn(changes['en'], russian)
        self.assertIn(changes['en'], english)

    def test_changelog_markdown_reads_back_as_the_same_entry(self):
        panel = self.manifest.component('marks_panel')
        changes = texts.parse_changelog(CHANGELOG)[('marks_panel', '0.2.0')]
        self.assertEqual(texts.parse_changelog(texts.changelog_markdown(panel, changes))[(panel.id, panel.version)], changes)

    def test_an_entry_without_russian_text_is_a_warning(self):
        english_only = texts.parse_changelog(CHANGELOG)[('core', '0.3.0')]
        findings = texts.check_texts(self.manifest.component('core'), english_only)
        self.assertEqual(findings.errors, [])
        self.assertTrue(any('### ru' in item.message for item in findings.warnings))
        self.assertEqual(texts.check_texts(self.manifest.component('core'), FIRST).items, [])

    def test_forum_title_starts_with_the_client_version(self):
        title = texts.forum_title('1.45.0.0', self.manifest.component('core'), 'ru')
        self.assertTrue(title.startswith(u'[1.45.0.0] Три отметки — '))

    def test_description_lists_dependencies_fair_play_and_data(self):
        companion = self.manifest.component('companion')
        text = texts.description(companion, self.manifest, 'ru', '1.45.0.0', FIRST)
        self.assertIn(companion.fair_play.ru, text)
        self.assertIn('`net.triotmetki.core` 0.1.0', text)
        self.assertIn(texts.LABELS['ru']['data'], text)
        self.assertIn('mods/1.45.0.0/', text)
        english = texts.description(self.manifest.component('core'), self.manifest, 'en', '1.45.0.0', None)
        self.assertIn(texts.LABELS['en']['no_dependencies'], english)
        self.assertIn(texts.LABELS['en']['no_changes'], english)
        self.assertNotIn(texts.LABELS['en']['data'], english)

    def test_dependency_list_carries_titles(self):
        items = texts.dependency_list(self.manifest.component('marks_panel'), self.manifest)
        self.assertEqual([item['id'] for item in items], ['core', 'companion'])
        self.assertTrue(all(item['title']['ru'] and item['title']['en'] for item in items))

    def test_missing_changelog_is_a_warning(self):
        findings = texts.check_texts(self.manifest.component('core'), None)
        self.assertEqual(findings.errors, [])
        self.assertEqual(len(findings.warnings), 1)


if __name__ == '__main__':
    unittest.main()
