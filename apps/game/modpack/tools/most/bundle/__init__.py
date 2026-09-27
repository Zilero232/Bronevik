"""Assembles dist/most: one folder per component with everything a МОСТ proposal needs, plus index.json.

    dist/most/index.json                   every component, its findings and the rule sources
    dist/most/<id>/<package id>_<v>.mtmod  the release package, unchanged
    dist/most/<id>/meta.xml                its meta.xml, extracted for review
    dist/most/<id>/previews/*.png          preview images (rules.PREVIEW_SIZES)
    dist/most/<id>/screenshots/*           client screenshots from installer/assets/screenshots/<id>/
    dist/most/<id>/description.ru.md       mod page texts (en too)
    dist/most/<id>/changelog.md            this version's CHANGELOG.md entry
    dist/most/<id>/submission.json         forum titles, dependencies, file hash and size, findings
"""
import hashlib
import io
import json
import os
import shutil

import layout
from setupkit import ASSETS_DIR, CATALOG_PATH
from setupkit.manifest import catalog as catalog_module
from setupkit.manifest.catalog import CatalogError
from setupkit.manifest.generate import ManifestError, build_manifest

from most import previews, texts
from most.package import check_package, read_package
from most.rules import GAME_VERSION, LANGUAGES, SOURCES, UPDATE_DAYS, Findings

SCREENSHOTS_DIR = os.path.join(ASSETS_DIR, 'screenshots')
INDEX = 'index.json'


class BundleError(RuntimeError):
    pass


def _sha256(path):
    digest = hashlib.sha256()
    with open(path, 'rb') as handle:
        for chunk in iter(lambda: handle.read(1 << 16), b''):
            digest.update(chunk)
    return digest.hexdigest()


def _write_text(path, text):
    with io.open(path, 'w', encoding='utf-8', newline='\n') as handle:
        handle.write(text)
    return path


def _write_json(path, value):
    return _write_text(path, json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def load_manifest(packages_dir, packages=None, catalog_path=CATALOG_PATH, assets_dir=ASSETS_DIR):
    """(manifest, layout packages by key): the installer's manifest over the built packages."""
    packages = packages if packages is not None else layout.split_packages('root_init.py')
    try:
        catalog = catalog_module.load(catalog_path, assets_dir)
        manifest, _ = build_manifest(packages, catalog, platform='lesta', packages_dir=packages_dir)
    except (CatalogError, ManifestError) as error:
        raise BundleError(str(error))
    return manifest, catalog, dict((package.key, package) for package in packages)


def bundle_component(component, manifest, catalog, package, options, out_dir):
    """Writes out_dir/<component id>/ and returns (its submission dict, Findings)."""
    findings = Findings()
    target = os.path.join(out_dir, component.id)
    if os.path.isdir(target):
        shutil.rmtree(target)
    os.makedirs(target)
    source = os.path.join(options['packages_dir'], component.file)
    shutil.copyfile(source, os.path.join(target, component.file))
    try:
        info = read_package(source)
    except ValueError as error:
        findings.error(component.id, str(error), 'mtmod')
        info = None
    if info is not None:
        _write_text(os.path.join(target, 'meta.xml'), info.meta_text)
        meta_dependencies = [(depend.package_id, depend.version) for depend in package.depends]
        findings.extend(check_package(info, component, meta_dependencies, options['release']))
    entry = catalog.entry(component.id)
    written = []
    if entry is not None and entry.preview.image and not options['skip_images']:
        written = previews.render_previews(os.path.join(options['assets_dir'], entry.preview.image), os.path.join(target, 'previews'))
    shots = previews.screenshots(os.path.join(options['screenshots_dir'], component.id))
    for shot in shots:
        os.makedirs(os.path.join(target, 'screenshots'), exist_ok=True)
        shutil.copyfile(shot, os.path.join(target, 'screenshots', os.path.basename(shot)))
    video = entry.preview.video if entry is not None else None
    if not options['skip_images']:
        findings.extend(previews.check_previews(component.id, written, shots, video))
    changes = texts.changelog_entry(options['changelog'], component)
    findings.extend(texts.check_texts(component, changes))
    for language in LANGUAGES:
        _write_text(os.path.join(target, 'description.%s.md' % language),
                    texts.description(component, manifest, language, options['game_version'], changes))
    _write_text(os.path.join(target, 'changelog.md'), '## %s %s\n\n%s\n' % (component.id, component.version, changes or ''))
    missing = [key for key in component.dependencies if key not in options['selected']]
    if missing:
        findings.warn(component.id, 'depends on %s, which this bundle leaves out: they must already be in MOST' % ', '.join(missing), 'ours')
    submission = {
        'id': component.id,
        'packageId': component.package_id,
        'version': component.version,
        'gameVersion': options['game_version'],
        'file': component.file,
        'sha256': _sha256(source),
        'size': os.path.getsize(source),
        'required': component.required,
        'category': component.category,
        'forumTitle': dict((language, texts.forum_title(options['game_version'], component, language)) for language in LANGUAGES),
        'title': dict((language, getattr(component.title, language)) for language in LANGUAGES),
        'dependencies': texts.dependency_list(component, manifest),
        'sendsData': texts.sends_data(component),
        'previews': [os.path.relpath(path, target).replace(os.sep, '/') for path in written],
        'screenshots': ['screenshots/' + os.path.basename(shot) for shot in shots],
        'video': video,
        'findings': [item.to_json() for item in findings.items],
    }
    _write_json(os.path.join(target, 'submission.json'), submission)
    return submission, findings


def assemble(packages_dir, game_version, out_dir, release=False, changelog=None, only=(), skip_images=False,
             screenshots_dir=SCREENSHOTS_DIR, assets_dir=ASSETS_DIR, packages=None, catalog_path=CATALOG_PATH):
    """Writes the bundle; returns (index dict, Findings). Raises BundleError when nothing can be bundled."""
    findings = Findings()
    if not GAME_VERSION.match(game_version or ''):
        findings.error('bundle', 'game version %r is not the client version, e.g. 1.45.0.0' % game_version, 'publication_rules')
    manifest, catalog, by_key = load_manifest(packages_dir, packages, catalog_path, assets_dir)
    keys = [component.id for component in manifest.components]
    unknown = [key for key in only if key not in keys]
    if unknown:
        raise BundleError('unknown components: %s (known: %s)' % (', '.join(unknown), ', '.join(keys)))
    selected = list(only) or keys
    options = {
        'packages_dir': packages_dir,
        'game_version': game_version,
        'release': release,
        'changelog': texts.load_changelog(changelog),
        'skip_images': skip_images,
        'screenshots_dir': screenshots_dir,
        'assets_dir': assets_dir,
        'selected': selected,
    }
    os.makedirs(out_dir, exist_ok=True)
    submissions = []
    for component in manifest.components:
        if component.id in selected:
            submission, component_findings = bundle_component(component, manifest, catalog, by_key[component.id], options, out_dir)
            submissions.append(submission)
            findings.extend(component_findings)
    index = {
        'modpackVersion': manifest.modpack_version,
        'gameVersion': game_version,
        'release': release,
        'updateWithinDays': UPDATE_DAYS,
        'components': submissions,
        'errors': len(findings.errors),
        'warnings': len(findings.warnings),
        'findings': [item.to_json() for item in findings.items if item.where == 'bundle'],
        'sources': SOURCES,
    }
    _write_json(os.path.join(out_dir, INDEX), index)
    return index, findings
