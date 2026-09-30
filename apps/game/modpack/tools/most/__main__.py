"""Assemble the МОСТ submission bundle from a release build.

Usage:
    python apps/game/modpack/tools/most --game-version 1.45.0.0 [--packages DIR] [--out DIR] [--release]
        [--changelog FILE] [--only ID ...] [--skip-images] [--strict]

--packages is the folder with the split .mtmod packages from tools/build/build.py (default dist), --out the
bundle folder (default dist/most). --release fails on packages that carry .py sources; --strict turns
warnings into a failure. Exit code 1 on errors. docs/ops/most-publishing.md describes what to do with it.
"""
import argparse
import os
import sys

TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if TOOLS_DIR not in sys.path:
    sys.path.insert(0, TOOLS_DIR)

from most import DEFAULT_CHANGELOG, DEFAULT_OUT, DEFAULT_PACKAGES  # noqa: E402
from most.bundle import BundleError, BundleRequest, assemble  # noqa: E402


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description='Assemble the Three Marks МОСТ submission bundle')
    parser.add_argument('--game-version', required=True, help='client version the build targets, e.g. 1.45.0.0')
    parser.add_argument('--packages', default=DEFAULT_PACKAGES, help='folder with the split .mtmod release packages')
    parser.add_argument('--out', default=DEFAULT_OUT, help='bundle folder')
    parser.add_argument('--release', action='store_true', help='fail on packages with .py sources (bytecode only)')
    parser.add_argument(
        '--changelog',
        default=DEFAULT_CHANGELOG,
        help='CHANGELOG.md with "## <id> <version>" or "## <version>" entries',
    )
    parser.add_argument('--only', nargs='+', default=(), help='bundle only these component ids')
    parser.add_argument('--skip-images', action='store_true', help='do not render previews (needs resvg-py and pillow)')
    parser.add_argument('--strict', action='store_true', help='fail on warnings too')
    return parser.parse_args(argv)


def request_of(args):
    return BundleRequest(
        packages_dir=args.packages,
        game_version=args.game_version,
        out_dir=args.out,
        release=args.release,
        changelog=args.changelog,
        only=args.only,
        skip_images=args.skip_images,
    )


def main(argv=None):
    args = parse_args(argv)
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(errors='replace')
    try:
        index, findings = assemble(request_of(args))
    except BundleError as error:
        print('ERROR: %s' % error)
        return 1

    for item in findings.items:
        print(item)
    counts = (args.out, len(index['components']), len(findings.errors), len(findings.warnings))
    print('Wrote %s: %d components, %d errors, %d warnings' % counts)
    if findings.errors or (args.strict and findings.warnings):
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
