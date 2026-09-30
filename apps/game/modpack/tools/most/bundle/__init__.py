"""Assembles dist/most: one folder per component with everything a МОСТ proposal needs, plus index.json.

    dist/most/index.json                   every component, its findings and the rule sources
    dist/most/<id>/<package id>_<v>.mtmod  the release package, unchanged
    dist/most/<id>/meta.xml                its meta.xml, extracted for review
    dist/most/<id>/previews/*.png          preview images (rules.PREVIEW_SIZES)
    dist/most/<id>/screenshots/*           client screenshots from catalog/screenshots/<id>/
    dist/most/<id>/description.ru.md       mod page texts (en too)
    dist/most/<id>/changelog.md            this version's CHANGELOG.md entry (### ru, ### en)
    dist/most/<id>/submission.json         forum titles, dependencies (ours and third-party), file hash and size,
                                           findings
"""
import dataclasses
import os
import shutil
from typing import Optional, Sequence

import layout
from fileio import sha256, write_json, write_text
from setupkit import ASSETS_DIR, CATALOG_DIR, CATALOG_PATH
from setupkit.manifest import catalog as catalog_module
from setupkit.manifest.catalog import CatalogError
from setupkit.manifest.generate import ManifestError, build_manifest

from most import previews, texts
from most.package import check_package, read_package
from most.rules import GAME_VERSION, LANGUAGES, SOURCES, UPDATE_DAYS, Findings

SCREENSHOTS_DIR = os.path.join(CATALOG_DIR, 'screenshots')
INDEX = 'index.json'


class BundleError(RuntimeError):
    pass


@dataclasses.dataclass(frozen=True)
class BundleRequest:
    """What to bundle: the built packages, the client version and where to write; the rest has defaults.

    `packages` are the layout packages (default: layout.split_packages); `only` limits the bundle to these ids.
    """
    packages_dir: str
    game_version: str
    out_dir: str
    release: bool = False
    changelog: Optional[str] = None
    only: Sequence[str] = ()
    skip_images: bool = False
    screenshots_dir: str = SCREENSHOTS_DIR
    assets_dir: str = ASSETS_DIR
    packages: Optional[list] = None
    catalog_path: str = CATALOG_PATH


@dataclasses.dataclass(frozen=True)
class _Bundle:
    request: BundleRequest
    manifest: object
    catalog: object
    changelog: dict
    selected: list


def load_manifest(packages_dir, packages=None, catalog_path=CATALOG_PATH, assets_dir=ASSETS_DIR):
    """(manifest, catalog, layout packages by key): the catalogue's manifest over the built packages."""
    packages = packages if packages is not None else layout.split_packages('root_init.py')
    try:
        catalog = catalog_module.load(catalog_path, assets_dir)
        manifest, _ = build_manifest(packages, catalog, platform='lesta', packages_dir=packages_dir)
    except (CatalogError, ManifestError) as error:
        raise BundleError(str(error))
    return manifest, catalog, dict((package.key, package) for package in packages)


def _fresh_dir(path):
    if os.path.isdir(path):
        shutil.rmtree(path)
    os.makedirs(path)


def _package_findings(component, package, source, bundle, target):
    """Checks the built package; extracts its meta.xml for review when it can be read."""
    findings = Findings()
    try:
        info = read_package(source)
    except ValueError as error:
        findings.error(component.id, str(error), 'mtmod')
        return findings
    write_text(os.path.join(target, 'meta.xml'), info.meta_text)
    meta_dependencies = [(depend.package_id, depend.version) for depend in package.depends]
    findings.extend(check_package(info, component, meta_dependencies, bundle.request.release))
    return findings


def _render_previews(entry, bundle, target):
    if entry is None or not entry.preview.image or bundle.request.skip_images:
        return []
    source = os.path.join(bundle.request.assets_dir, entry.preview.image)
    return previews.render_previews(source, os.path.join(target, 'previews'))


def _copy_screenshots(component, bundle, target):
    shots = previews.screenshots(os.path.join(bundle.request.screenshots_dir, component.id))
    for shot in shots:
        os.makedirs(os.path.join(target, 'screenshots'), exist_ok=True)
        shutil.copyfile(shot, os.path.join(target, 'screenshots', os.path.basename(shot)))
    return shots


def _write_texts(component, bundle, changes, target):
    game_version = bundle.request.game_version
    for language in LANGUAGES:
        text = texts.description(component, bundle.manifest, language, game_version, changes)
        write_text(os.path.join(target, 'description.%s.md' % language), text)
    write_text(os.path.join(target, 'changelog.md'), texts.changelog_markdown(component, changes))


def _left_out_dependencies(component, bundle):
    findings = Findings()
    missing = [key for key in component.dependencies if key not in bundle.selected]
    if missing:
        message = 'depends on %s, which this bundle leaves out: they must already be in MOST' % ', '.join(missing)
        findings.warn(component.id, message, 'ours')
    return findings


def _submission(component, bundle, source, media, findings):
    """submission.json; `media` is (written previews, screenshots, video) and paths are relative to the folder."""
    written, shots, video = media
    target = os.path.join(bundle.request.out_dir, component.id)
    game_version = bundle.request.game_version
    return {
        'id': component.id,
        'packageId': component.package_id,
        'version': component.version,
        'gameVersion': game_version,
        'file': component.file,
        'sha256': sha256(source),
        'size': os.path.getsize(source),
        'required': component.required,
        'category': component.category,
        'forumTitle': dict(
            (language, texts.forum_title(game_version, component, language)) for language in LANGUAGES
        ),
        'title': dict((language, getattr(component.title, language)) for language in LANGUAGES),
        'dependencies': texts.dependency_list(component, bundle.manifest),
        'externalDependencies': texts.external_dependency_list(component, bundle.manifest),
        'sendsData': texts.sends_data(component),
        'previews': [os.path.relpath(path, target).replace(os.sep, '/') for path in written],
        'screenshots': ['screenshots/' + os.path.basename(shot) for shot in shots],
        'video': video,
        'findings': [item.to_json() for item in findings.items],
    }


def bundle_component(component, package, bundle):
    """Writes <out>/<component id>/ and returns (its submission dict, Findings)."""
    target = os.path.join(bundle.request.out_dir, component.id)
    _fresh_dir(target)
    source = os.path.join(bundle.request.packages_dir, component.file)
    shutil.copyfile(source, os.path.join(target, component.file))
    findings = _package_findings(component, package, source, bundle, target)

    entry = bundle.catalog.entry(component.id)
    written = _render_previews(entry, bundle, target)
    shots = _copy_screenshots(component, bundle, target)
    video = entry.preview.video if entry is not None else None
    if not bundle.request.skip_images:
        findings.extend(previews.check_previews(component.id, written, shots, video))

    changes = texts.changelog_entry(bundle.changelog, component)
    findings.extend(texts.check_texts(component, changes))
    _write_texts(component, bundle, changes, target)
    findings.extend(_left_out_dependencies(component, bundle))

    submission = _submission(component, bundle, source, (written, shots, video), findings)
    write_json(os.path.join(target, 'submission.json'), submission)
    return submission, findings


def _open_bundle(request):
    manifest, catalog, by_key = load_manifest(
        request.packages_dir,
        request.packages,
        request.catalog_path,
        request.assets_dir,
    )
    keys = [component.id for component in manifest.components]
    unknown = [key for key in request.only if key not in keys]
    if unknown:
        raise BundleError('unknown components: %s (known: %s)' % (', '.join(unknown), ', '.join(keys)))
    selected = list(request.only) or keys
    bundle = _Bundle(request, manifest, catalog, texts.load_changelog(request.changelog), selected)
    return bundle, by_key


def _game_version_findings(game_version):
    findings = Findings()
    if not GAME_VERSION.match(game_version or ''):
        message = 'game version %r is not the client version, e.g. 1.45.0.0' % game_version
        findings.error('bundle', message, 'publication_rules')
    return findings


def assemble(request):
    """Writes the bundle; returns (index dict, Findings). Raises BundleError when nothing can be bundled."""
    findings = _game_version_findings(request.game_version)
    bundle, by_key = _open_bundle(request)
    os.makedirs(request.out_dir, exist_ok=True)

    submissions = []
    for component in bundle.manifest.components:
        if component.id not in bundle.selected:
            continue
        submission, component_findings = bundle_component(component, by_key[component.id], bundle)
        submissions.append(submission)
        findings.extend(component_findings)

    index = {
        'modpackVersion': bundle.manifest.modpack_version,
        'gameVersion': request.game_version,
        'release': request.release,
        'updateWithinDays': UPDATE_DAYS,
        'components': submissions,
        'errors': len(findings.errors),
        'warnings': len(findings.warnings),
        'findings': [item.to_json() for item in findings.items if item.where == 'bundle'],
        'sources': SOURCES,
    }
    write_json(os.path.join(request.out_dir, INDEX), index)
    return index, findings
