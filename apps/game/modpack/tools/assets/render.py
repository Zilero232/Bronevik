"""Renders the PNG files of every asset set from its sources (assets/assets.json `sources` -> `files`).

SVG sources go through resvg (resvg-py), raster sources (a third-party PNG) are resized with Pillow (LANCZOS).
Each rendition is `<stem><suffix>_<size>.png`; `alpha` scales the opacity (the dimmed pulse frame).
The client shows them through Scaleform `img://gui/maps/icons/...` in the HUD labels, which reads PNG
directly: no DDS or atlas is needed (atlases are only for the vanilla battleAtlas, which we never touch).

    uv run python tools/assets/render.py           # rewrite every set's PNG files
    uv run python tools/assets/render.py --check   # fail when a rendition is missing
"""
import io
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'build'))

import asset_sets  # noqa: E402

SOURCE_EXTENSIONS = ('.svg', '.png')


def libraries():
    try:
        import resvg_py
        from PIL import Image
    except ImportError as error:
        raise SystemExit('render needs resvg-py and pillow (uv sync in apps/game/modpack): %s' % error)
    return resvg_py, Image


def rendition_name(stem, rendition):
    return '%s%s_%d.png' % (stem, rendition.get('suffix', ''), rendition['size'])


def render_one(path, rendition):
    resvg_py, Image = libraries()
    size = rendition['size']
    if path.endswith('.svg'):
        image = Image.open(io.BytesIO(bytes(resvg_py.svg_to_bytes(svg_path=path, width=size, height=size)))).convert('RGBA')
    else:
        image = Image.open(path).convert('RGBA').resize((size, size), Image.LANCZOS)
    alpha = rendition.get('alpha')
    if alpha is not None:
        image.putalpha(image.getchannel('A').point(lambda value: int(round(value * alpha))))
    output = io.BytesIO()
    image.save(output, 'PNG', optimize=True)
    return output.getvalue()


def planned(asset_set):
    """(output path, source path, rendition) for every PNG the set's sources make."""
    if not asset_set.sources:
        return []
    source_dir = asset_set.path(asset_set.sources)
    out_dir = asset_set.path(asset_set.files)
    items = []
    for name in sorted(os.listdir(source_dir)):
        stem, extension = os.path.splitext(name)
        if extension.lower() not in SOURCE_EXTENSIONS:
            continue
        for rendition in asset_set.renditions:
            items.append((os.path.join(out_dir, rendition_name(stem, rendition)), os.path.join(source_dir, name), rendition))
    return items


def main(argv):
    check = '--check' in argv
    stale = []
    for asset_set in asset_sets.load():
        for output, source, rendition in planned(asset_set):
            data = render_one(source, rendition)
            if check:
                if not os.path.isfile(output):
                    stale.append(output)
                continue
            if not os.path.isdir(os.path.dirname(output)):
                os.makedirs(os.path.dirname(output))
            with open(output, 'wb') as handle:
                handle.write(data)
    if stale:
        sys.stderr.write('missing renditions (run tools/assets/render.py):\n  %s\n' % '\n  '.join(stale))
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
