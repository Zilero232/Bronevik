#!/usr/bin/env python3
"""Build the Three Marks packages.

Usage:
    python apps/modpack/tools/build/build.py [--single] [--wg] [--require-pyc]
        [--compiler auto|owg|py27] [--owg-compiler PATH] [--python27 PATH] [--out DIR] [--install-dir DIR]

Default: one `.mtmod` per package (core, companion, each feature) in apps/modpack/dist, each with
meta.xml naming its dependencies. `--single` builds the pre-split single package instead
(otmetki.<version>.mtmod, id otmetki.companion). `--wg` writes `.wotmod` for WG clients.

The production client loads only compiled `mod_*.pyc`: without a compiler the packages carry `.py`
sources and only load in a development client. Release builds pass --require-pyc (see compilers.py).
"""
import argparse
import os
import shutil
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import archive  # noqa: E402
import compilers  # noqa: E402
import layout  # noqa: E402


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description='Build the Three Marks .mtmod / .wotmod packages')
    parser.add_argument('--single', action='store_true', help='one package with everything (the pre-split format)')
    parser.add_argument('--wg', action='store_true', help='write .wotmod for WG clients instead of .mtmod for Lesta')
    parser.add_argument('--require-pyc', action='store_true', help='fail when no compiler is available (release builds)')
    parser.add_argument('--compiler', choices=('auto', 'owg', 'py27'), default='auto', help='bytecode compiler backend')
    parser.add_argument('--owg-compiler', help='path to owg_python_compiler')
    parser.add_argument('--python27', help='path to a Python 2.7 interpreter')
    parser.add_argument('--out', default=os.path.join(layout.MODPACK_DIR, 'dist'), help='output directory')
    parser.add_argument('--install-dir', help='also copy the packages here, e.g. <game>/mods/<client version>')
    return parser.parse_args(argv)


def build(args):
    staging = tempfile.mkdtemp(prefix='otmetki-build-')
    try:
        root_init = os.path.join(staging, 'root_init.py')
        with open(root_init, 'w', encoding='utf-8', newline='\n') as handle:
            handle.write(layout.ROOT_INIT)
        packages = [layout.single_package(root_init)] if args.single else layout.split_packages(root_init)
        name, compile_entries = compilers.select(args.compiler, args.owg_compiler, args.python27)
        if compile_entries is None:
            if args.require_pyc:
                raise SystemExit('no Python 2.7 bytecode compiler found (owg_python_compiler or Python 2.7); release builds need .pyc')
            print('WARNING: no compiler found, packaging .py sources (development client only)')
        platform = 'wg' if args.wg else 'lesta'
        os.makedirs(args.out, exist_ok=True)
        outputs = []
        for index, package in enumerate(packages):
            entries = package.files
            if compile_entries is not None:
                entries = compile_entries(entries, os.path.join(staging, 'pkg%d' % index))
            output = os.path.join(args.out, archive.file_name(package, platform, single=args.single))
            archive.write_package(output, entries, archive.meta_xml(package))
            print('Built %s (%d files)' % (output, len(entries)))
            outputs.append(output)
        if args.install_dir:
            os.makedirs(args.install_dir, exist_ok=True)
            for output in outputs:
                shutil.copy2(output, args.install_dir)
            print('Copied %d package(s) to %s' % (len(outputs), args.install_dir))
        return outputs
    finally:
        shutil.rmtree(staging, ignore_errors=True)


def main(argv=None):
    build(parse_args(argv))


if __name__ == '__main__':
    main()
