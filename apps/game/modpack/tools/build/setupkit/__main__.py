"""Build the Windows installer around the release packages.

Usage:
    python apps/game/modpack/tools/build/setupkit [--packages DIR] [--out DIR] [--strict]
        [--skip-artwork] [--skip-openwg] [--compile] [--iscc PATH] [--version VERSION]

Writes <out>/components.json (default apps/game/modpack/dist/installer) and, under <out>/build, the generated
Inno includes, the rendered artwork and the pinned OpenWG.Utils files. --compile then runs ISCC on
installer/setup.iss and writes <out>/otmetki-setup-<version>.exe. --packages is the folder with the
split .mtmod packages from tools/build/build.py (required for --compile; adds sha256/size to the manifest).
"""
import argparse
import io
import json
import os
import subprocess
import sys

BUILD_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BUILD_DIR not in sys.path:
    sys.path.insert(0, BUILD_DIR)

import layout  # noqa: E402
from setupkit import ASSETS_DIR, CATALOG_PATH, INSTALLER_DIR, MODPACK_DIR  # noqa: E402
from setupkit.inno import iscc, render  # noqa: E402
from setupkit.manifest import catalog as catalog_module  # noqa: E402
from setupkit.manifest.generate import ManifestError, build_manifest  # noqa: E402

DEFAULT_OUT = os.path.join(MODPACK_DIR, 'dist', 'installer')
CACHE_DIR = os.path.join(MODPACK_DIR, '.cache')


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description='Build the Three Marks installer (Inno Setup)')
    parser.add_argument('--packages', help='folder with the split .mtmod release packages')
    parser.add_argument('--out', default=DEFAULT_OUT, help='output folder')
    parser.add_argument('--strict', action='store_true', help='fail when a package has no catalog entry or an entry has no package')
    parser.add_argument('--skip-artwork', action='store_true', help='do not render images (needs resvg-py and pillow)')
    parser.add_argument('--skip-openwg', action='store_true', help='do not fetch OpenWG.Utils')
    parser.add_argument('--compile', action='store_true', help='run ISCC on installer/setup.iss')
    parser.add_argument('--iscc', help='path to ISCC.exe')
    parser.add_argument('--version', help='installer version (default: the companion version)')
    return parser.parse_args(argv)


def write_text(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with io.open(path, 'w', encoding='utf-8', newline='\n') as handle:
        handle.write(text)
    return path


def generate(args):
    """Manifest + includes (+ artwork, OpenWG); returns (manifest, build_dir)."""
    if args.compile and not args.packages:
        raise SystemExit('--compile needs --packages (the split packages from tools/build/build.py)')
    catalog = catalog_module.load(CATALOG_PATH, ASSETS_DIR)
    manifest, warnings = build_manifest(layout.split_packages('root_init.py'), catalog, packages_dir=args.packages, strict=args.strict)
    for warning in warnings:
        print('WARNING: %s' % warning)
    build_dir = os.path.join(args.out, 'build')
    write_text(os.path.join(args.out, 'components.json'), json.dumps(manifest.to_json(), ensure_ascii=False, indent=2) + '\n')
    write_text(os.path.join(build_dir, 'components.iss'), render.components_iss(manifest))
    write_text(os.path.join(build_dir, 'files.iss'), render.files_iss(manifest))
    print('Wrote %s (%d components)' % (os.path.join(args.out, 'components.json'), len(manifest.components)))
    if not args.skip_artwork:
        from setupkit.artwork.render import render_all
        print('Rendered %d images' % len(render_all(manifest, catalog, ASSETS_DIR, build_dir)))
    if not args.skip_openwg:
        from setupkit.openwg.fetch import fetch
        fetch(os.path.join(build_dir, 'openwg'), os.path.join(CACHE_DIR, 'openwg'))
        print('OpenWG.Utils ready in %s' % os.path.join(build_dir, 'openwg'))
    return manifest, build_dir


def compile_installer(args, manifest, build_dir):
    compiler = iscc.find_iscc(args.iscc)
    if compiler is None:
        raise SystemExit('ISCC.exe (Inno Setup 6.7) not found: pass --iscc or set $ISCC')
    version = args.version or manifest.modpack_version
    defines = {
        'OtmBuildDir': os.path.abspath(build_dir),
        'OtmPackagesDir': os.path.abspath(args.packages),
        'OtmAppVersion': version,
    }
    try:
        iscc.compile_script(compiler, os.path.join(INSTALLER_DIR, 'setup.iss'), defines, os.path.abspath(args.out), 'otmetki-setup-%s' % version)
    except subprocess.CalledProcessError as error:
        raise SystemExit('ISCC failed (exit %d):\n%s%s' % (error.returncode, error.output or '', error.stderr or ''))
    output = os.path.join(args.out, 'otmetki-setup-%s.exe' % version)
    print('Built %s' % output)
    return output


def main(argv=None):
    args = parse_args(argv)
    try:
        manifest, build_dir = generate(args)
    except (catalog_module.CatalogError, ManifestError) as error:
        raise SystemExit(str(error))
    if args.compile:
        compile_installer(args, manifest, build_dir)


if __name__ == '__main__':
    main()
