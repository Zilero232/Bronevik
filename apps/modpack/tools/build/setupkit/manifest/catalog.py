"""Reads and checks installer/catalog/catalog.json.

Every problem is collected, then reported at once as a CatalogError. Texts become Inno Setup custom
messages, so braces (Inno constants) and control characters other than a newline are refused.
"""
import io
import json
import os
import re

from .model import ID_PATTERN, LANGUAGES, Catalog, CatalogEntry, Category, Localized, Preset, Preview

PREVIEW_EXTENSIONS = ('.svg', '.png')
FORBIDDEN_TEXT = re.compile(r'[{}\x00-\x09\x0b-\x1f]')


class CatalogError(ValueError):

    def __init__(self, problems):
        self.problems = list(problems)
        super(CatalogError, self).__init__('catalog.json:\n  ' + '\n  '.join(self.problems))


class _Reader(object):

    def __init__(self, assets_dir):
        self.assets_dir = assets_dir
        self.problems = []

    def fail(self, where, message):
        self.problems.append('%s: %s' % (where, message))

    def ident(self, where, value):
        if not isinstance(value, str) or not ID_PATTERN.match(value):
            self.fail(where, 'id must match %s, got %r' % (ID_PATTERN.pattern, value))
            return str(value)
        return value

    def localized(self, where, value, required=True):
        if not isinstance(value, dict):
            self.fail(where, 'expected {"ru": ..., "en": ...}')
            return Localized('', '')
        texts = []
        for language in LANGUAGES:
            text = value.get(language, '')
            if not isinstance(text, str) or (required and not text.strip()):
                self.fail(where, 'missing %s text' % language)
                text = ''
            if FORBIDDEN_TEXT.search(text):
                self.fail(where, '%s text has braces or control characters' % language)
            texts.append(text)
        extra = sorted(set(value) - set(LANGUAGES))
        if extra:
            self.fail(where, 'unknown languages %s' % ', '.join(extra))
        return Localized(*texts)

    def preview(self, where, value):
        if value is None:
            return Preview()
        if not isinstance(value, dict):
            self.fail(where, 'preview must be an object')
            return Preview()
        image = value.get('image')
        video = value.get('video')
        if image is not None:
            if not image.lower().endswith(PREVIEW_EXTENSIONS):
                self.fail(where, 'preview image must be %s' % ' or '.join(PREVIEW_EXTENSIONS))
            elif not os.path.isfile(os.path.join(self.assets_dir, image)):
                self.fail(where, 'preview image %s not found in installer/assets' % image)
        if video is not None and not str(video).startswith('https://'):
            self.fail(where, 'preview video must be an https:// link')
        return Preview(image, video)

    def category(self, index, raw):
        where = 'categories[%d]' % index
        return Category(self.ident(where, raw.get('id')), self.localized(where + '.title', raw.get('title')),
                        self.localized(where + '.description', raw.get('description')))

    def preset(self, index, raw):
        where = 'presets[%d]' % index
        return Preset(self.ident(where, raw.get('id')), self.localized(where + '.title', raw.get('title')),
                      self.localized(where + '.description', raw.get('description')), bool(raw.get('custom', False)))

    def entry(self, index, raw):
        where = 'components[%d]' % index
        return CatalogEntry(
            id=self.ident(where, raw.get('id')),
            category=raw.get('category', ''),
            title=self.localized(where + '.title', raw.get('title')),
            description=self.localized(where + '.description', raw.get('description')),
            fair_play=self.localized(where + '.fairPlay', raw.get('fairPlay')),
            presets=tuple(raw.get('presets', ())),
            required=bool(raw.get('required', False)),
            preview=self.preview(where + '.preview', raw.get('preview')),
            dependencies=tuple(raw.get('dependencies', ())),
        )


def _unique(reader, where, ids):
    seen = set()
    for item in ids:
        if item in seen:
            reader.fail(where, 'duplicate id %s' % item)
        seen.add(item)


def parse(raw, assets_dir):
    reader = _Reader(assets_dir)
    categories = tuple(reader.category(index, item) for index, item in enumerate(raw.get('categories', ())))
    presets = tuple(reader.preset(index, item) for index, item in enumerate(raw.get('presets', ())))
    entries = tuple(reader.entry(index, item) for index, item in enumerate(raw.get('components', ())))
    catalog = Catalog(
        categories=categories,
        presets=presets,
        components=entries,
        owned_patterns=tuple(raw.get('ownedPatterns', ())),
        fallback_category=raw.get('fallbackCategory', ''),
        fallback_fair_play=reader.localized('fallbackFairPlay', raw.get('fallbackFairPlay')),
    )
    _check(reader, catalog)
    if reader.problems:
        raise CatalogError(reader.problems)
    return catalog


def _check(reader, catalog):
    category_ids = [category.id for category in catalog.categories]
    preset_ids = [preset.id for preset in catalog.presets]
    entry_ids = [entry.id for entry in catalog.components]
    _unique(reader, 'categories', category_ids)
    _unique(reader, 'presets', preset_ids)
    _unique(reader, 'components', entry_ids)
    custom = [preset.id for preset in catalog.presets if preset.custom]
    if len(custom) != 1 or not catalog.presets or not catalog.presets[-1].custom:
        reader.fail('presets', 'exactly one preset must be custom, and it must come last')
    elif catalog.presets[0].custom:
        reader.fail('presets', 'the first preset is the default one and cannot be custom')
    if catalog.fallback_category not in category_ids:
        reader.fail('fallbackCategory', 'unknown category %r' % catalog.fallback_category)
    if not catalog.owned_patterns:
        reader.fail('ownedPatterns', 'list the file masks of our packages (uninstall and clean-up rely on it)')
    for pattern in catalog.owned_patterns:
        if '\\' in pattern or '/' in pattern or not pattern.endswith(('.mtmod', '.wotmod')):
            reader.fail('ownedPatterns', '%r must be a bare package file mask' % pattern)
    for entry in catalog.components:
        where = 'components.%s' % entry.id
        if entry.category not in category_ids:
            reader.fail(where, 'unknown category %r' % entry.category)
        for preset in entry.presets:
            if preset not in preset_ids or preset in custom:
                reader.fail(where, 'unknown or custom preset %r' % preset)
        if entry.required and entry.presets:
            reader.fail(where, 'a required component is in every preset; drop its presets list')
        for dependency in entry.dependencies:
            if dependency not in entry_ids or dependency == entry.id:
                reader.fail(where, 'unknown dependency %r' % dependency)


def load(path, assets_dir):
    with io.open(path, encoding='utf-8') as handle:
        return parse(json.load(handle), assets_dir)
