"""Render the HUD components' catalog previews with the in-game HUD page.

Usage:
    python tools/build/previews [--html packages/ui/gameface/hud.html] [--out catalog/previews]
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile

PREVIEWS_DIR = os.path.dirname(os.path.abspath(__file__))
if os.path.dirname(PREVIEWS_DIR) not in sys.path:
    sys.path.insert(0, os.path.dirname(PREVIEWS_DIR))

from previews.states import HUD_PREVIEWS, MODPACK_DIR, job  # noqa: E402

RENDERER = os.path.join(PREVIEWS_DIR, 'render.mjs')
DEFAULT_HTML = os.path.join(MODPACK_DIR, 'packages', 'ui', 'gameface', 'hud.html')
DEFAULT_OUT = os.path.join(MODPACK_DIR, 'catalog', 'previews')
PALETTE_COLOURS = 256


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description='Render the HUD components\' catalog previews with the HUD page')
    parser.add_argument('--html', default=DEFAULT_HTML, help='the built HUD page')
    parser.add_argument('--out', default=DEFAULT_OUT, help='output folder')
    return parser.parse_args(argv)


def compress(out_dir):
    """Each rendered preview as a 256-colour PNG: the flat backdrop and the plates keep it a few dozen KB."""
    from PIL import Image

    for component_id in HUD_PREVIEWS:
        path = os.path.join(out_dir, '%s.png' % component_id)
        image = Image.open(path).convert('RGB')
        image.quantize(colors=PALETTE_COLOURS, dither=Image.Dither.NONE).save(path, format='PNG', optimize=True)


def main(argv=None):
    args = parse_args(argv)
    with tempfile.TemporaryDirectory(prefix='otmetki-previews-') as directory:
        job_path = os.path.join(directory, 'job.json')
        with open(job_path, 'w', encoding='utf-8') as handle:
            json.dump(job(), handle, ensure_ascii=False)
        subprocess.run(['node', RENDERER, args.html, job_path, args.out], check=True, cwd=MODPACK_DIR)
    compress(args.out)


if __name__ == '__main__':
    main()
