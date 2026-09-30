"""Reads and checks catalog/catalog.json.

Every problem is collected, then reported at once as a CatalogError. Texts are shown by the manager and
copied into МОСТ pages, so control characters other than a newline are refused. Entries with
`kind: "dependency"` are third-party runtime mods, checked here and passed through to components.json.
"""
import fnmatch
import io
import json
import os
import re

from .model import (CONTEXTS, DEPENDENCY_KIND, ID_PATTERN, LANGUAGES, PERF_LEVELS, Author, Catalog, CatalogEntry, Category, ConflictRule, Dependency,
                    Licence, Localized, Preset, Preview)

PREVIEW_EXTENSIONS = ('.svg', '.png')
AUDIO_EXTENSIONS = ('.mp3', '.ogg', '.wav')
# Audio previews are the sounds a component already ships, so they are read from the modpack's assets/ folder.
AUDIO_DIR = 'assets'
MASK_PATTERN = re.compile(r'^[a-z0-9*?._-]+$')
OWNED_PATH_PATTERN = re.compile(r'^[a-z0-9_./-]+$')
FORBIDDEN_TEXT = re.compile(r'[\x00-\x09\x0b-\x1f]')
SHA256_PATTERN = re.compile(r'^[0-9a-f]{64}$')
PACKAGE_ID_PATTERN = re.compile(r'^[a-z0-9]+(?:[._-][a-z0-9]+)+$')
VERSION_PATTERN = re.compile(r'^\d+(?:\.\d+)*$')
DEPENDENCY_EXTENSION = '.mtmod'
DEPENDENCY_FIELDS = ('id', 'kind', 'packageId', 'version', 'file', 'title', 'description', 'author', 'licence', 'sourceUrl', 'sha256', 'size',
                     'requiredBy', 'optional', 'restartRequired')


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
                self.fail(where, '%s text has control characters' % language)
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
        audio = value.get('audio')
        if image is not None:
            if not image.lower().endswith(PREVIEW_EXTENSIONS):
                self.fail(where, 'preview image must be %s' % ' or '.join(PREVIEW_EXTENSIONS))
            elif not os.path.isfile(os.path.join(self.assets_dir, image)):
                self.fail(where, 'preview image %s not found in catalog/' % image)
        if video is not None and not str(video).startswith('https://'):
            self.fail(where, 'preview video must be an https:// link')
        if audio is not None:
            if not str(audio).lower().endswith(AUDIO_EXTENSIONS) or '..' in str(audio):
                self.fail(where, 'preview audio must be a %s file under assets/' % ' or '.join(AUDIO_EXTENSIONS))
            elif not os.path.isfile(self.audio_path(audio)):
                self.fail(where, 'preview audio %s not found in assets/' % audio)
        return Preview(image, video, audio)

    def audio_path(self, audio):
        return os.path.join(os.path.dirname(os.path.abspath(self.assets_dir)), AUDIO_DIR, *str(audio).split('/'))

    def perf(self, where, value):
        if value not in PERF_LEVELS:
            self.fail(where, 'perf must be one of %s, got %r' % (', '.join(PERF_LEVELS), value))
            return None
        return value

    def context(self, where, value):
        if value not in CONTEXTS:
            self.fail(where, 'context must be one of %s, got %r' % (', '.join(CONTEXTS), value))
            return None
        return value

    def conflict(self, index, raw):
        where = 'conflicts[%d]' % index
        patterns = raw.get('patterns')
        if not isinstance(patterns, list) or not patterns:
            self.fail(where + '.patterns', 'list the file name or package id masks')
            patterns = []
        for pattern in patterns:
            if not isinstance(pattern, str) or not MASK_PATTERN.match(pattern) or pattern.strip('*?') == '':
                self.fail(where + '.patterns', '%r must be a lowercase mask with some fixed text' % (pattern,))
        components = raw.get('components')
        if not isinstance(components, list) or not components:
            self.fail(where + '.components', 'list the ids of our components it duplicates')
            components = []
        return ConflictRule(self.ident(where, raw.get('id')), self.localized(where + '.title', raw.get('title')), tuple(patterns),
                            tuple(str(item) for item in components), self.localized(where + '.note', raw.get('note')))

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
            perf=self.perf(where + '.perf', raw.get('perf')),
            context=self.context(where + '.context', raw.get('context')),
        )

    def https(self, where, value):
        if not isinstance(value, str) or not value.startswith('https://') or len(value) <= len('https://'):
            self.fail(where, 'must be an https:// link, got %r' % (value,))
            return str(value)
        return value

    def text(self, where, value):
        if not isinstance(value, str) or not value.strip() or FORBIDDEN_TEXT.search(value):
            self.fail(where, 'must be a non-empty single-line text')
            return str(value)
        return value

    def sha256(self, where, value):
        if not isinstance(value, str) or not SHA256_PATTERN.match(value):
            self.fail(where, 'must be a lowercase 64-hex sha256')
            return str(value)
        return value

    def dependency(self, index, raw):
        where = 'components[%d]' % index
        unknown = sorted(set(raw) - set(DEPENDENCY_FIELDS))
        if unknown:
            self.fail(where, 'a dependency has no %s (it is not our package)' % ', '.join(unknown))
        author = raw.get('author') if isinstance(raw.get('author'), dict) else {}
        licence = raw.get('licence') if isinstance(raw.get('licence'), dict) else {}
        size = raw.get('size')
        if isinstance(size, bool) or not isinstance(size, int) or size <= 0:
            self.fail(where + '.size', 'must be the byte size of the release file')
            size = 0
        required_by = raw.get('requiredBy')
        if not isinstance(required_by, list) or not required_by:
            self.fail(where + '.requiredBy', 'list the ids of our components that need it')
            required_by = []
        optional = raw.get('optional')
        if not isinstance(optional, bool):
            self.fail(where + '.optional', 'must be true or false')
        restart = raw.get('restartRequired')
        if not isinstance(restart, bool):
            self.fail(where + '.restartRequired', 'must be true or false')
        return Dependency(
            id=self.ident(where, raw.get('id')),
            kind=DEPENDENCY_KIND,
            package_id=str(raw.get('packageId', '')),
            version=str(raw.get('version', '')),
            file=str(raw.get('file', '')),
            title=self.localized(where + '.title', raw.get('title')),
            description=self.localized(where + '.description', raw.get('description')),
            author=Author(self.text(where + '.author.name', author.get('name')), self.https(where + '.author.url', author.get('url'))),
            licence=Licence(self.text(where + '.licence.name', licence.get('name')), self.https(where + '.licence.url', licence.get('url')),
                            self.sha256(where + '.licence.sha256', licence.get('sha256'))),
            source_url=self.https(where + '.sourceUrl', raw.get('sourceUrl')),
            sha256=self.sha256(where + '.sha256', raw.get('sha256')),
            size=size,
            required_by=tuple(str(item) for item in required_by),
            optional=bool(optional),
            restart_required=bool(restart),
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
    entries = []
    dependencies = []
    for index, item in enumerate(raw.get('components', ())):
        kind = item.get('kind')
        if kind == DEPENDENCY_KIND:
            dependencies.append(reader.dependency(index, item))
        elif kind is not None:
            reader.fail('components[%d]' % index, 'unknown kind %r (ours have none, third-party mods are "%s")' % (kind, DEPENDENCY_KIND))
        else:
            entries.append(reader.entry(index, item))
    catalog = Catalog(
        categories=categories,
        presets=presets,
        components=tuple(entries),
        owned_patterns=tuple(raw.get('ownedPatterns', ())),
        fallback_category=raw.get('fallbackCategory', ''),
        fallback_fair_play=reader.localized('fallbackFairPlay', raw.get('fallbackFairPlay')),
        dependencies=tuple(dependencies),
        owned_paths=tuple(raw.get('ownedPaths', ())),
        conflicts=tuple(reader.conflict(index, item) for index, item in enumerate(raw.get('conflicts', ()))),
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
    _unique(reader, 'components', entry_ids + [dependency.id for dependency in catalog.dependencies])
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
    for dependency in catalog.dependencies:
        _check_dependency(reader, catalog, entry_ids, dependency)
    for path in catalog.owned_paths:
        if not isinstance(path, str) or not OWNED_PATH_PATTERN.match(path) or path.startswith(('/', 'res/')) or '..' in path:
            reader.fail('ownedPaths', '%r must be a lowercase in-game path prefix without res/' % (path,))
    _unique(reader, 'conflicts', [rule.id for rule in catalog.conflicts])
    for rule in catalog.conflicts:
        for component_id in rule.components:
            if component_id not in entry_ids:
                reader.fail('conflicts.%s' % rule.id, 'unknown component %r' % component_id)
        for pattern in rule.patterns:
            if any(pattern.startswith(prefix.lower()) for prefix in our_prefixes(catalog.owned_patterns)):
                reader.fail('conflicts.%s' % rule.id, '%r names our own packages' % pattern)


def our_prefixes(owned_patterns):
    """The package id prefixes of our packages: `net.triotmetki.*.mtmod` -> `net.triotmetki.`."""
    return tuple(sorted(set(pattern.split('*', 1)[0] for pattern in owned_patterns if '*' in pattern)))


def _check_dependency(reader, catalog, entry_ids, dependency):
    where = 'components.%s' % dependency.id
    if not PACKAGE_ID_PATTERN.match(dependency.package_id):
        reader.fail(where, 'packageId %r is not a package id' % dependency.package_id)
    if any(dependency.package_id.lower().startswith(prefix.lower()) for prefix in our_prefixes(catalog.owned_patterns)):
        reader.fail(where, 'packageId %s is ours: a dependency is a third-party mod' % dependency.package_id)
    if any(fnmatch.fnmatch(dependency.file.lower(), pattern.lower()) for pattern in catalog.owned_patterns):
        reader.fail(where, 'file %s matches ownedPatterns: uninstall would take it for ours' % dependency.file)
    if not VERSION_PATTERN.match(dependency.version):
        reader.fail(where, 'version %r is not a release version' % dependency.version)
    expected = '%s_%s%s' % (dependency.package_id, dependency.version, DEPENDENCY_EXTENSION)
    if dependency.file != expected:
        reader.fail(where, 'file must be %s, got %s' % (expected, dependency.file))
    if len(set(dependency.required_by)) != len(dependency.required_by):
        reader.fail(where, 'requiredBy lists a component twice')
    for component_id in dependency.required_by:
        if component_id not in entry_ids:
            reader.fail(where, 'requiredBy: unknown component %r' % component_id)


def load(path, assets_dir):
    with io.open(path, encoding='utf-8') as handle:
        return parse(json.load(handle), assets_dir)
