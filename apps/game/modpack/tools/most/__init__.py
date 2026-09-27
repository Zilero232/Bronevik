"""most: assembles the МОСТ (Lesta's official mod installer) submission bundle from a release build.

    rules/     what the bundle is checked against, each rule with its source (docs/ops/most-publishing.md)
    package/   reads a built .mtmod: zip shape, meta.xml, bytecode vs sources
    texts/     ru/en descriptions, the forum topic title, the changelog and the dependency list
    previews/  preview images in the submission sizes, rendered from the catalog SVGs via setupkit artwork
    bundle/    one folder per component under dist/most plus index.json

Run it as `python tools/most --packages dist --game-version 1.45.0.0` (see __main__.py). Python 3 only: it
reuses tools/build (layout, archive) and setupkit (catalog, manifest, artwork).
"""
import os
import sys

MOST_DIR = os.path.dirname(os.path.abspath(__file__))
TOOLS_DIR = os.path.dirname(MOST_DIR)
BUILD_DIR = os.path.join(TOOLS_DIR, 'build')
MODPACK_DIR = os.path.dirname(TOOLS_DIR)
DEFAULT_PACKAGES = os.path.join(MODPACK_DIR, 'dist')
DEFAULT_OUT = os.path.join(MODPACK_DIR, 'dist', 'most')
DEFAULT_CHANGELOG = os.path.join(MODPACK_DIR, 'CHANGELOG.md')

if BUILD_DIR not in sys.path:
    sys.path.insert(0, BUILD_DIR)
