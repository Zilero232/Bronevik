"""Merges the package layout (ids, versions, files, dependencies) with the catalog (UI metadata).

Nothing the layout knows is repeated in the catalog: a component's id is its package key, its file name
comes from archive.file_name and its dependencies start with the package's own `depends`. Third-party
runtime mods (`kind: "dependency"`) have no package here: they are passed through as the catalog pins them.
"""
import dataclasses
import fnmatch
import hashlib
import os

import archive
import layout

from .model import Component, Localized, Manifest, Preview

PREVIEWS_DIR = 'previews'


class ManifestError(ValueError):
    pass


def _sha256(path):
    digest = hashlib.sha256()
    with open(path, 'rb') as handle:
        for chunk in iter(lambda: handle.read(1 << 16), b''):
            digest.update(chunk)
    return digest.hexdigest()


def _fallback(package, catalog):
    title = Localized(package.name, package.name)
    return title, Localized(package.description, package.description), catalog.fallback_fair_play


def _component(package, catalog, platform, packages_dir, warnings):
    entry = catalog.entry(package.key)
    if entry is None:
        warnings.append('package %s has no catalog entry: shipped unticked in category %s' % (package.key, catalog.fallback_category))
        title, description, fair_play = _fallback(package, catalog)
        category, presets, required, preview, extra, perf = catalog.fallback_category, (), False, Preview(), (), None
    else:
        title, description, fair_play = entry.title, entry.description, entry.fair_play
        category, presets, required, extra, perf = entry.category, entry.presets, entry.required, entry.dependencies, entry.perf
        image = '%s/%s.png' % (PREVIEWS_DIR, package.key) if entry.preview.image else None
        audio = audio_path(package.key, entry.preview.audio) if entry.preview.audio else None
        preview = Preview(image, entry.preview.video, audio)
    dependencies = []
    for dependency in [depend.key for depend in package.depends] + list(extra):
        if dependency not in dependencies:
            dependencies.append(dependency)
    file_name = archive.file_name(package, platform)
    sha256 = size = None
    if packages_dir is not None:
        path = os.path.join(packages_dir, file_name)
        if not os.path.isfile(path):
            raise ManifestError('%s not found in %s: build the packages first (tools/build/build.py)' % (file_name, packages_dir))
        sha256, size = _sha256(path), os.path.getsize(path)
    return Component(
        id=package.key,
        package_id=package.package_id,
        version=package.version,
        file=file_name,
        category=category,
        title=title,
        description=description,
        fair_play=fair_play,
        required=required,
        default=required or catalog.default_preset in presets,
        presets=tuple(preset.id for preset in catalog.presets) if required else tuple(presets),
        preview=preview,
        dependencies=tuple(dependencies),
        catalogued=entry is not None,
        sha256=sha256,
        size=size,
        perf=perf,
    )


def audio_path(key, source):
    """previews/<id>.<ext>: the component's sound, copied next to components.json (setupkit.audio)."""
    return '%s/%s%s' % (PREVIEWS_DIR, key, os.path.splitext(source)[1].lower())


def build_manifest(packages, catalog, platform='lesta', packages_dir=None, strict=False):
    """packages: layout.split_packages(); returns (Manifest, warnings). strict turns warnings into errors."""
    warnings = []
    components = [_component(package, catalog, platform, packages_dir, warnings) for package in packages]
    keys = set(component.id for component in components)
    for entry in catalog.components:
        if entry.id not in keys:
            warnings.append('catalog entry %s has no package (not built by this layout)' % entry.id)
    problems = []
    for component in components:
        missing = [dependency for dependency in component.dependencies if dependency not in keys]
        if missing:
            problems.append('%s depends on %s, which this build does not ship' % (component.id, ', '.join(missing)))
        if not any(fnmatch.fnmatch(component.file, pattern) for pattern in catalog.owned_patterns):
            problems.append('%s matches no ownedPatterns mask: uninstall would not recognise it' % component.file)
    dependencies = _dependencies(catalog, keys, warnings)
    if strict:
        problems.extend(warnings)
    if problems:
        raise ManifestError('\n'.join(problems))
    category_order = dict((category.id, index) for index, category in enumerate(catalog.categories))
    catalog_order = dict((entry.id, index) for index, entry in enumerate(catalog.components))
    components.sort(key=lambda component: (category_order[component.category], catalog_order.get(component.id, len(catalog_order)), component.id))
    used = set(component.category for component in components)
    manifest = Manifest(
        modpack_version=layout.modpack_version(),
        platform=platform,
        extension=archive.EXTENSIONS[platform],
        categories=tuple(category for category in catalog.categories if category.id in used),
        presets=catalog.presets,
        components=tuple(components),
        owned_patterns=catalog.owned_patterns,
        dependencies=dependencies,
        owned_paths=catalog.owned_paths,
        conflicts=_conflicts(catalog, keys),
    )
    return manifest, warnings


def _conflicts(catalog, keys):
    """The conflict rules, each with only the components this build ships; a rule left with none is dropped."""
    rules = []
    for rule in catalog.conflicts:
        components = tuple(component_id for component_id in rule.components if component_id in keys)
        if components:
            rules.append(dataclasses.replace(rule, components=components))
    return tuple(rules)


def _dependencies(catalog, keys, warnings):
    """The catalog's third-party runtime mods, passed through; requiredBy keeps only the components this build ships."""
    shipped = []
    for dependency in catalog.dependencies:
        required_by = tuple(component_id for component_id in dependency.required_by if component_id in keys)
        left_out = [component_id for component_id in dependency.required_by if component_id not in keys]
        if left_out:
            warnings.append('dependency %s is required by %s, which this build does not ship' % (dependency.id, ', '.join(left_out)))
        if required_by:
            shipped.append(dataclasses.replace(dependency, required_by=required_by))
    return tuple(shipped)
