"""Test helpers: a small fake release build (core, companion, one feature) written with tools/build/archive."""
import os
import sys

TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if TOOLS_DIR not in sys.path:
    sys.path.insert(0, TOOLS_DIR)

import most  # noqa: E402,F401  (puts tools/build on sys.path)
import archive  # noqa: E402
import layout  # noqa: E402

FEATURE = 'marks_panel'
PYC_MAGIC = b'\x03\xf3\r\n'
SOURCE_TEXT = b'x = 1\n'


def fake_packages(source_file, suffix='.pyc'):
    """core <- companion <- marks_panel, each shipping one script built from source_file."""
    def files(folder):
        return [(source_file, layout.PACKAGE_ROOT + '/' + folder + '/__init__' + suffix)]
    core = layout.Package('core', 'net.triotmetki.core', 'Three Marks Core', '0.1.0', 'core runtime', files('core'))
    companion = layout.Package(
        'companion',
        'otmetki.companion',
        'Three Marks Companion',
        '0.1.0',
        'companion',
        files('companion'),
        [core],
    )
    feature = layout.Package(
        FEATURE,
        'net.triotmetki.' + FEATURE,
        'MoE panel',
        '0.2.0',
        'MoE panel',
        files('features/' + FEATURE),
        [core, companion],
    )
    return [core, companion, feature]


def write_build(directory, suffix='.pyc'):
    """Writes the fake packages into directory; returns the layout packages."""
    source = os.path.join(directory, 'script' + suffix)
    with open(source, 'wb') as handle:
        handle.write(PYC_MAGIC if suffix == '.pyc' else SOURCE_TEXT)
    packages = fake_packages(source, suffix)
    for package in packages:
        path = os.path.join(directory, archive.file_name(package, 'lesta'))
        archive.write_package(path, package.files, archive.meta_xml(package))
    return packages
