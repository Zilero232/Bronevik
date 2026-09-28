"""The binary assets the packages ship (assets/assets.json) and their licence notices.

Each set belongs to one feature; the build puts its files into that feature's package at the set's `target`
(an in-game `res/...` path), with the licence file and the generated THIRD_PARTY_NOTICES.md next to them.

    python tools/build/asset_sets.py --write   # regenerate assets/THIRD_PARTY_NOTICES.md
    python tools/build/asset_sets.py --check   # fail when a set is invalid or the notices are stale
"""
import io
import json
import os
import sys

MODPACK_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ASSETS_DIR = os.path.join(MODPACK_DIR, 'assets')
MANIFEST = os.path.join(ASSETS_DIR, 'assets.json')
NOTICES = os.path.join(ASSETS_DIR, 'THIRD_PARTY_NOTICES.md')
VENDOR_LICENCES = os.path.join(MODPACK_DIR, 'packages', 'core', 'vendor', 'licenses')
NOTICES_NAME = 'THIRD_PARTY_NOTICES.md'
ICONS_ROOT = 'res/gui/maps/icons/otmetki'
ORIGINAL_LICENCE = 'LicenseRef-TriOtmetki-Artwork'
# What a third-party set may be under: redistribution in a paid product allowed, no NonCommercial clause.
PERMISSIVE_LICENCES = ('CC0-1.0', 'CC-BY-3.0', 'CC-BY-4.0', 'CC-BY-SA-3.0', 'CC-BY-SA-4.0', 'MIT', 'BSD-2-Clause', 'BSD-3-Clause',
                       'Apache-2.0', 'MPL-2.0', 'Zlib', 'WTFPL')
# A closed mod the author allowed us to ship in writing: its licence file quotes the permission
# (docs/ops/mod-authors-outreach.md).
PERMISSION_PREFIX = 'LicenseRef-Permission-'
ORIGINS = ('original', 'third_party')
REQUIRED = ('id', 'feature', 'title', 'origin', 'author', 'copyright', 'license', 'license_file', 'url', 'files', 'target', 'contents',
            'fair_play')
ASSET_EXTENSIONS = ('.png', '.mp3')


class AssetSet(object):

    def __init__(self, data):
        self.data = data
        for key in REQUIRED:
            setattr(self, key, data.get(key))
        self.sources = data.get('sources')
        self.include = data.get('include')
        self.renditions = data.get('renditions') or []
        self.license_target = data.get('license_target') or '%s/%s' % (self.target, os.path.basename(self.license_file or ''))

    def path(self, relative):
        return os.path.join(ASSETS_DIR, *relative.split('/'))

    def file_names(self):
        directory = self.path(self.files)
        if not os.path.isdir(directory):
            return []
        names = sorted(name for name in os.listdir(directory) if os.path.splitext(name)[1].lower() in ASSET_EXTENSIONS)
        return [name for name in names if name in self.include] if self.include else names

    def archive_files(self):
        """(source path, archive path) of the set's files and its licence."""
        files = [(os.path.join(self.path(self.files), name), '%s/%s' % (self.target, name)) for name in self.file_names()]
        files.append((self.path(self.license_file), self.license_target))
        return files

    def problems(self):
        found = ['%s: no %s' % (self.id, key) for key in REQUIRED if not self.data.get(key)]
        if found:
            return found
        if self.origin not in ORIGINS:
            found.append('%s: origin %s' % (self.id, self.origin))
        allowed = PERMISSIVE_LICENCES + ((ORIGINAL_LICENCE,) if self.origin == 'original' else ())
        permitted = self.origin == 'third_party' and self.license.startswith(PERMISSION_PREFIX)
        if self.license not in allowed and not permitted:
            found.append('%s: licence %s is not allowed for %s assets' % (self.id, self.license, self.origin))
        if not os.path.isfile(self.path(self.license_file)):
            found.append('%s: licence file %s is missing' % (self.id, self.license_file))
        if not self.target.startswith('res/'):
            found.append('%s: target must be an in-game res/ path' % self.id)
        if not self.file_names():
            found.append('%s: no files in %s' % (self.id, self.files))
        if self.include and sorted(self.include) != self.file_names():
            found.append('%s: missing %s' % (self.id, sorted(set(self.include) - set(self.file_names()))))
        return found


def load(path=MANIFEST):
    with io.open(path, encoding='utf-8') as handle:
        return [AssetSet(item) for item in json.load(handle)['sets']]


def problems(sets):
    found = []
    seen = set()
    for asset_set in sets:
        if asset_set.id in seen:
            found.append('%s: duplicate id' % asset_set.id)
        seen.add(asset_set.id)
        found.extend(asset_set.problems())
    return found


def feature_files(feature_id, sets=None):
    """What a feature's package ships besides its sources: its sets' files and licences, and the notices."""
    sets = [asset_set for asset_set in (load() if sets is None else sets) if asset_set.feature == feature_id]
    if not sets:
        return []
    files = []
    for asset_set in sets:
        files.extend(item for item in asset_set.archive_files() if item[1] not in [path for _, path in files])
    files.append((NOTICES, '%s/%s/%s' % (ICONS_ROOT, feature_id, NOTICES_NAME)))
    return files


def _row(asset_set):
    return '| %s | %s | %s | %s | `%s` |' % (asset_set.title, asset_set.author, asset_set.license, asset_set.feature, asset_set.target)


def _section(asset_set):
    lines = ['### %s' % asset_set.title, '',
             '- Author: %s' % asset_set.author,
             '- Copyright: %s' % asset_set.copyright,
             '- Licence: %s (`assets/%s`)' % (asset_set.license, asset_set.license_file),
             '- Source: %s' % asset_set.url,
             '- Contents: %s' % asset_set.contents,
             '- Ships in: `%s` (component `%s`)' % (asset_set.target, asset_set.feature),
             '- Fair play: %s' % asset_set.fair_play, '']
    return lines


def vendor_libraries():
    if not os.path.isdir(VENDOR_LICENCES):
        return []
    return sorted(os.path.splitext(name)[0] for name in os.listdir(VENDOR_LICENCES))


def notices(sets):
    third = [asset_set for asset_set in sets if asset_set.origin == 'third_party']
    original = [asset_set for asset_set in sets if asset_set.origin == 'original']
    lines = ['# Third-party notices', '',
             '<!-- Generated by tools/build/asset_sets.py --write from assets/assets.json. Do not edit by hand. -->', '',
             'The «Три отметки» modpack (free and subscription editions) ships the assets below. Third-party assets are used',
             'under licences that allow redistribution in a paid product; each licence text ships next to the files.', '',
             '| Asset | Author | Licence | Component | In-game path |', '| --- | --- | --- | --- | --- |']
    lines += [_row(asset_set) for asset_set in third + original]
    lines += ['', '## Third-party assets', '']
    for asset_set in third:
        lines += _section(asset_set)
    lines += ['## Original assets', '',
              'Original artwork, (c) Три отметки. Popular packs (Джов, Near_You, Kotyarko, ПРОТанки, XVM skins) were studied as a',
              'visual reference only (layout, sizes, readability, colour conventions); nothing of theirs was traced or copied.', '']
    for asset_set in original:
        lines += _section(asset_set)
    libraries = vendor_libraries()
    if libraries:
        lines += ['## Python libraries', '',
                  'Vendored in the core package with their licence texts (`gui/mods/otmetki/core/vendor/licenses`): %s.' % ', '.join(libraries),
                  '']
    return '\n'.join(lines)


def main(argv):
    sets = load()
    found = problems(sets)
    if found:
        sys.stderr.write('\n'.join(found) + '\n')
        return 1
    text = notices(sets)
    if '--write' in argv:
        with io.open(NOTICES, 'w', encoding='utf-8', newline='\n') as handle:
            handle.write(text)
        return 0
    with io.open(NOTICES, encoding='utf-8') as handle:
        if handle.read() != text:
            sys.stderr.write('assets/THIRD_PARTY_NOTICES.md is stale: python tools/build/asset_sets.py --write\n')
            return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
