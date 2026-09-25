#!/usr/bin/env python3
"""Build bronevik.<version>.wotmod.

Usage:
    python apps/mod/build.py [--require-pyc] [--python27 PATH] [--out DIR] [--install-dir DIR]

Compiles the sources with a Python 2.7 interpreter when one is available (the game client
runs CPython 2.7 and loads .pyc from packages). Without Python 2.7 the package ships .py
sources and a warning is printed; pass --require-pyc to fail instead (use it for releases).
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
PACKAGE_ROOT = 'res/scripts/client/gui/mods'
ZIP_DATE = (2020, 1, 1, 0, 0, 0)
DESCRIPTION = 'Bronevik companion: own battle results, marks of excellence and session stats for bronevik.app'

PY27_CANDIDATES = (
    ['py', '-2.7'],
    ['python2.7'],
    ['python2'],
    ['C:\\Python27\\python.exe'],
)

COMPILE_SCRIPT = r'''
import json, py_compile, sys
jobs = json.loads(sys.stdin.read())
for src, dst, dfile in jobs:
    py_compile.compile(src, cfile=dst, dfile=dfile, doraise=True)
print('compiled %d files' % len(jobs))
'''


def read_version():
    with open(os.path.join(SRC, 'bronevik', 'version.py'), encoding='utf-8') as handle:
        text = handle.read()
    values = dict(re.findall(r"^(MOD_ID|MOD_NAME|VERSION) = '([^']+)'", text, re.M))
    return values['MOD_ID'], values['MOD_NAME'], values['VERSION']


def is_py27(command):
    try:
        output = subprocess.run(command + ['-c', 'import sys; print("%d.%d" % sys.version_info[:2])'],
                                capture_output=True, text=True, timeout=20)
    except (OSError, subprocess.SubprocessError):
        return False
    return output.returncode == 0 and output.stdout.strip() == '2.7'


def find_python27(explicit):
    candidates = []
    if explicit:
        candidates.append([explicit])
    for env in ('BRONEVIK_PY27', 'PYTHON27'):
        if os.environ.get(env):
            candidates.append([os.environ[env]])
    candidates.extend(PY27_CANDIDATES)
    for command in candidates:
        if is_py27(command):
            return command
    return None


def source_files():
    yield os.path.join(SRC, 'mod_bronevik.py'), PACKAGE_ROOT + '/mod_bronevik.py'
    package = os.path.join(SRC, 'bronevik')
    for directory, dirs, files in os.walk(package):
        dirs[:] = sorted(d for d in dirs if d != '__pycache__')
        for name in sorted(files):
            if name.endswith('.py'):
                path = os.path.join(directory, name)
                relative = os.path.relpath(path, SRC).replace(os.sep, '/')
                yield path, PACKAGE_ROOT + '/' + relative


def compile_sources(python27, staging):
    jobs = []
    entries = []
    for path, archive_path in source_files():
        target = os.path.join(staging, archive_path.replace('/', os.sep) + 'c')
        os.makedirs(os.path.dirname(target), exist_ok=True)
        dfile = archive_path[len('res/'):]
        jobs.append([path, target, dfile])
        entries.append((target, archive_path + 'c'))
    result = subprocess.run(python27 + ['-c', COMPILE_SCRIPT], input=json.dumps(jobs), capture_output=True, text=True)
    if result.returncode != 0:
        sys.stderr.write(result.stdout + result.stderr)
        raise SystemExit('Python 2.7 compilation failed')
    print(result.stdout.strip())
    return entries


def meta_xml(mod_id, name, version):
    return (
        '<root>\n'
        '    <id>%s</id>\n'
        '    <version>%s</version>\n'
        '    <name>%s</name>\n'
        '    <description>%s</description>\n'
        '</root>\n'
    ) % (escape(mod_id), escape(version), escape(name), escape(DESCRIPTION))


def write_package(path, entries, meta):
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


def main():
    parser = argparse.ArgumentParser(description='Build the Bronevik .wotmod package')
    parser.add_argument('--python27', help='path to a Python 2.7 interpreter')
    parser.add_argument('--require-pyc', action='store_true', help='fail when Python 2.7 is not available')
    parser.add_argument('--out', default=os.path.join(ROOT, 'dist'), help='output directory')
    parser.add_argument('--install-dir', help='also copy the package into this directory, e.g. <game>/mods/<client version>')
    args = parser.parse_args()

    mod_id, name, version = read_version()
    python27 = find_python27(args.python27)
    staging = tempfile.mkdtemp(prefix='bronevik-build-')
    try:
        if python27 is not None:
            print('Python 2.7: %s' % ' '.join(python27))
            entries = compile_sources(python27, staging)
        elif args.require_pyc:
            raise SystemExit('Python 2.7 not found; install it or pass --python27 (release builds need .pyc)')
        else:
            print('WARNING: Python 2.7 not found, packaging .py sources (development build only)')
            entries = list(source_files())
        os.makedirs(args.out, exist_ok=True)
        output = os.path.join(args.out, 'bronevik.%s.wotmod' % version)
        write_package(output, entries, meta_xml(mod_id, name, version))
        print('Built %s (%d files)' % (output, len(entries)))
        if args.install_dir:
            os.makedirs(args.install_dir, exist_ok=True)
            shutil.copy2(output, args.install_dir)
            print('Copied to %s' % args.install_dir)
    finally:
        shutil.rmtree(staging, ignore_errors=True)


if __name__ == '__main__':
    main()
