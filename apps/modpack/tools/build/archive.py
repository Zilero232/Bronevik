"""Package writer: a stored (uncompressed) zip with explicit directory entries and meta.xml.

Lesta clients from 1.35 load `.mtmod` packages from mods/<client version>/; WG clients load `.wotmod`.
The format is the same, only the extension differs.
"""
import zipfile
from xml.sax.saxutils import escape

ZIP_DATE = (2020, 1, 1, 0, 0, 0)
ZIP_EPOCH = 1577836800  # ZIP_DATE as a Unix timestamp, for reproducible .pyc headers
EXTENSIONS = {'lesta': 'mtmod', 'wg': 'wotmod'}


def meta_xml(package):
    """meta.xml. Dependencies are listed for installers and people; whether the client reads them is
    unverified, and the code never relies on load order (see packages/core/registry.py)."""
    lines = [
        '<root>',
        '    <id>%s</id>' % escape(package.package_id),
        '    <version>%s</version>' % escape(package.version),
        '    <name>%s</name>' % escape(package.name),
        '    <description>%s</description>' % escape(package.description),
    ]
    if package.depends:
        lines.append('    <dependencies>')
        for dependency in package.depends:
            lines.append('        <dependency>')
            lines.append('            <id>%s</id>' % escape(dependency.package_id))
            lines.append('            <version>%s</version>' % escape(dependency.version))
            lines.append('        </dependency>')
        lines.append('    </dependencies>')
    lines.append('</root>')
    return '\n'.join(lines) + '\n'


def file_name(package, platform, single=False):
    extension = EXTENSIONS[platform]
    if single:
        return 'otmetki.%s.%s' % (package.version, extension)
    return '%s_%s.%s' % (package.package_id, package.version, extension)


def write_package(path, entries, meta):
    """entries: (source path, archive path). Written in archive-path order with every parent directory."""
    written = set()
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_STORED) as package:
        info = zipfile.ZipInfo('meta.xml', ZIP_DATE)
        info.external_attr = 0o644 << 16
        package.writestr(info, meta.encode('utf-8'))
        for source, archive_path in sorted(entries, key=lambda item: item[1]):
            parts = archive_path.split('/')[:-1]
            for index in range(1, len(parts) + 1):
                directory = '/'.join(parts[:index]) + '/'
                if directory not in written:
                    written.add(directory)
                    dir_info = zipfile.ZipInfo(directory, ZIP_DATE)
                    dir_info.external_attr = (0o40755 << 16) | 0x10
                    package.writestr(dir_info, b'')
            file_info = zipfile.ZipInfo(archive_path, ZIP_DATE)
            file_info.external_attr = 0o644 << 16
            with open(source, 'rb') as handle:
                package.writestr(file_info, handle.read())
