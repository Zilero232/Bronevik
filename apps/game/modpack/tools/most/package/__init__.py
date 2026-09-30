"""Reads a built .mtmod and checks it against its component and the МОСТ rules."""
import os
import zipfile
import xml.etree.ElementTree as ElementTree

from most.rules import (
    BYTECODE_SUFFIX,
    META_FIELDS,
    PACKAGE_EXTENSION,
    PACKAGE_ID,
    SOURCE_SUFFIX,
    VERSION,
    Findings,
)


class PackageInfo(object):

    def __init__(self, path, meta_text, meta, dependencies, names, stored):
        self.path = path
        self.meta_text = meta_text
        self.meta = meta
        self.dependencies = dependencies
        self.names = names
        self.stored = stored

    @property
    def scripts(self):
        return [name for name in self.names if name.startswith('res/scripts/')]


def parse_meta(text):
    """meta.xml -> ({field: text}, [(dependency id, version)]). Raises ValueError on broken XML."""
    try:
        root = ElementTree.fromstring(text)
    except ElementTree.ParseError as error:
        raise ValueError('meta.xml is not well-formed XML: %s' % error)
    meta = dict((field, _text(root, field)) for field in META_FIELDS)
    dependencies = [(_text(node, 'id'), _text(node, 'version')) for node in root.findall('dependencies/dependency')]
    return meta, dependencies


def _text(node, path):
    return (node.findtext(path) or '').strip()


def read_package(path):
    """PackageInfo for a .mtmod; raises ValueError when it is not a zip with meta.xml at its root."""
    if not zipfile.is_zipfile(path):
        raise ValueError('%s is not a zip archive' % os.path.basename(path))
    with zipfile.ZipFile(path) as archive:
        infos = archive.infolist()
        names = [info.filename for info in infos]
        if 'meta.xml' not in names:
            raise ValueError('%s has no meta.xml at its root' % os.path.basename(path))
        meta_text = archive.read('meta.xml').decode('utf-8')
    meta, dependencies = parse_meta(meta_text)
    stored = all(info.compress_type == zipfile.ZIP_STORED for info in infos)
    return PackageInfo(path, meta_text, meta, dependencies, names, stored)


def _check_file_name(info, component, findings):
    where = component.id
    name = os.path.basename(info.path)
    if not name.endswith(PACKAGE_EXTENSION):
        findings.error(where, '%s: Lesta clients load %s packages' % (name, PACKAGE_EXTENSION), 'mtmod')
    if name != component.file:
        message = 'file %s, expected %s (<id>_<version>%s)' % (name, component.file, PACKAGE_EXTENSION)
        findings.error(where, message, 'wotstat_packaging')


def _check_meta(info, component, meta_dependencies, findings):
    where = component.id
    meta = info.meta
    for field in ('id', 'version', 'name', 'description'):
        if not meta[field]:
            findings.error(where, 'meta.xml has no <%s>' % field, 'wotstat_packaging')
    if meta['id'] and not PACKAGE_ID.match(meta['id']):
        findings.error(where, 'meta.xml id %r is not a dotted lower-case id' % meta['id'], 'wotstat_packaging')
    if meta['id'] != component.package_id:
        findings.error(where, 'meta.xml id %r, the layout says %r' % (meta['id'], component.package_id), 'ours')
    if meta['version'] != component.version:
        message = 'meta.xml version %r, the layout says %r: rebuild' % (meta['version'], component.version)
        findings.error(where, message, 'ours')
    elif not VERSION.match(component.version):
        findings.error(where, 'version %r is not X.Y.Z' % component.version, 'ours')
    expected = sorted(tuple(pair) for pair in meta_dependencies)
    if sorted(info.dependencies) != expected:
        findings.error(where, 'meta.xml dependencies %s, expected %s' % (sorted(info.dependencies), expected), 'ours')


def _check_scripts(info, component, release, findings):
    where = component.id
    sources = [path for path in info.scripts if path.endswith(SOURCE_SUFFIX)]
    bytecode = [path for path in info.scripts if path.endswith(BYTECODE_SUFFIX)]
    if sources:
        message = (
            '%d .py sources in the package: the production client loads only .pyc (build with --require-pyc)'
            % len(sources)
        )
        report = findings.error if release else findings.warn
        report(where, message, 'mtmod')
    elif not bytecode and info.scripts:
        findings.error(where, 'no .pyc in res/scripts', 'mtmod')


def check_package(info, component, meta_dependencies, release):
    """component: a setupkit manifest Component; meta_dependencies: the (package id, version) pairs the
    build writes into meta.xml (the layout package's own `depends`, not the catalog extras)."""
    findings = Findings()
    _check_file_name(info, component, findings)
    _check_meta(info, component, meta_dependencies, findings)
    if not info.stored:
        findings.warn(component.id, 'the zip is compressed; tools/build writes stored (uncompressed) packages', 'ours')
    _check_scripts(info, component, release, findings)
    return findings
