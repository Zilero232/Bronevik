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
PANEL_CHANGES = {'ru': u'- Крупнее шрифт.', 'en': '- Bigger font.'}
ENGLISH_ONLY = {'en': '- English only.'}
GAME_VERSION = '1.45.0.0'
GAMEFACE_LINE_RU = (
    u'- OpenWG Gameface 1.2.2 (`net.openwg.gameface_1.2.2.mtmod`, лицензия MIT, автор OpenWG): '
    u'https://gitlab.com/openwg/wot.gameface'
)


@unittest.skipUnless(PY3, 'the MOST bundler needs Python 3')
class TextsTest(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp)
        self.manifest, _, _ = load_manifest(self.tmp, write_build(self.tmp))

    def component(self, key):
        return self.manifest.component(key)

    def description(self, key, language, changes):
        return texts.description(self.component(key), self.manifest, language, GAME_VERSION, changes)

    def test_parse_changelog_reads_a_component_entry_per_language(self):
        changelog = texts.parse_changelog(CHANGELOG)

        self.assertEqual(changelog[('marks_panel', '0.2.0')], PANEL_CHANGES)

    def test_changelog_entry_prefers_the_components_own_entry(self):
        changelog = texts.parse_changelog(CHANGELOG)

        entry = texts.changelog_entry(changelog, self.component('marks_panel'))

        self.assertEqual(entry, PANEL_CHANGES)

    def test_changelog_entry_falls_back_to_the_modpack_entry_of_its_version(self):
        changelog = texts.parse_changelog(CHANGELOG)

        entry = texts.changelog_entry(changelog, self.component('core'))

        self.assertEqual(entry, FIRST)

    def test_changelog_entry_is_none_without_an_entry(self):
        entry = texts.changelog_entry({}, self.component('core'))

        self.assertIsNone(entry)

    def test_an_entry_without_language_sections_serves_both_languages(self):
        entry = texts.parse_changelog(CHANGELOG)[(None, '0.1.0')]

        self.assertEqual(entry, FIRST)

    def test_changes_text_takes_the_asked_language(self):
        self.assertEqual(texts.changes_text(PANEL_CHANGES, 'ru'), PANEL_CHANGES['ru'])
        self.assertEqual(texts.changes_text(PANEL_CHANGES, 'en'), PANEL_CHANGES['en'])

    def test_changes_text_falls_back_to_the_other_language(self):
        text = texts.changes_text(ENGLISH_ONLY, 'ru')

        self.assertEqual(text, '- English only.')

    def test_changes_text_is_none_without_an_entry(self):
        self.assertIsNone(texts.changes_text(None, 'ru'))

    def test_description_takes_the_changes_in_its_language(self):
        russian = self.description('marks_panel', 'ru', PANEL_CHANGES)
        english = self.description('marks_panel', 'en', PANEL_CHANGES)

        self.assertIn(PANEL_CHANGES['ru'], russian)
        self.assertNotIn(PANEL_CHANGES['en'], russian)
        self.assertIn(PANEL_CHANGES['en'], english)

    def test_changelog_markdown_reads_back_as_the_same_entry(self):
        panel = self.component('marks_panel')

        markdown = texts.changelog_markdown(panel, PANEL_CHANGES)

        self.assertEqual(texts.parse_changelog(markdown)[(panel.id, panel.version)], PANEL_CHANGES)

    def test_an_entry_without_russian_text_is_a_warning(self):
        findings = texts.check_texts(self.component('core'), ENGLISH_ONLY)

        self.assertEqual(findings.errors, [])
        self.assertTrue([item for item in findings.warnings if '### ru' in item.message])

    def test_a_bilingual_entry_passes(self):
        findings = texts.check_texts(self.component('core'), FIRST)

        self.assertEqual(findings.items, [])

    def test_missing_changelog_is_one_warning(self):
        findings = texts.check_texts(self.component('core'), None)

        self.assertEqual(findings.errors, [])
        self.assertEqual(len(findings.warnings), 1)

    def test_forum_title_starts_with_the_client_version(self):
        title = texts.forum_title(GAME_VERSION, self.component('core'), 'ru')

        self.assertTrue(title.startswith(u'[1.45.0.0] Три отметки — '))

    def test_description_lists_fair_play_dependencies_data_and_install_folder(self):
        companion = self.component('companion')

        text = self.description('companion', 'ru', FIRST)

        self.assertIn(companion.fair_play.ru, text)
        self.assertIn('`net.triotmetki.core` 0.1.0', text)
        self.assertIn(texts.LABELS['ru']['data'], text)
        self.assertIn('mods/1.45.0.0/', text)

    def test_description_without_dependencies_or_changes_says_so(self):
        english = self.description('core', 'en', None)

        self.assertIn(texts.LABELS['en']['no_dependencies'], english)
        self.assertIn(texts.LABELS['en']['no_changes'], english)
        self.assertNotIn(texts.LABELS['en']['data'], english)
        self.assertNotIn(texts.LABELS['en']['external'], english)

    def test_description_lists_third_party_mods_as_external_requirements(self):
        russian = self.description('marks_panel', 'ru', FIRST)
        english = self.description('marks_panel', 'en', FIRST)

        self.assertIn(texts.LABELS['ru']['external'], russian)
        self.assertIn(GAMEFACE_LINE_RU, russian)
        self.assertIn('- GUIFlash 0.6.6 (`gambiter.guiflash_0.6.6.mtmod`, MIT licence', english)
        self.assertIn('`net.triotmetki.core` 0.1.0', english)

    def test_external_dependency_list_names_the_upstream(self):
        items = texts.external_dependency_list(self.component('marks_panel'), self.manifest)

        upstream = [(item['id'], item['packageId'], item['version']) for item in items]
        self.assertEqual(
            upstream,
            [('openwg_gameface', 'net.openwg.gameface', '1.2.2'), ('guiflash', 'gambiter.guiflash', '0.6.6')],
        )
        self.assertEqual(items[1]['url'], 'https://github.com/CH4MPi/GUIFlash')

    def test_external_dependency_list_is_empty_for_a_component_without_them(self):
        items = texts.external_dependency_list(self.component('companion'), self.manifest)

        self.assertEqual(items, [])

    def test_dependency_list_carries_titles(self):
        items = texts.dependency_list(self.component('marks_panel'), self.manifest)

        self.assertEqual([item['id'] for item in items], ['core', 'companion'])
        for item in items:
            self.assertTrue(item['title']['ru'])
            self.assertTrue(item['title']['en'])


if __name__ == '__main__':
    unittest.main()
