"""Preview images for a submission, rendered from the catalog's preview (catalog/previews/*.svg).

The SVG goes through setupkit's resvg renderer (tools/build/setupkit/artwork) and is cover-cropped to each
of PREVIEW_SIZES with Pillow, the way the manager's 640x360 previews are. Without resvg-py and Pillow
(`uv sync` in apps/game/modpack) the SVG is copied as is and the bundle carries a warning.
"""
import io
import os
import shutil

from most.rules import MAX_SCREENSHOTS, PREVIEW_SIZES, Findings


SCREENSHOT_EXTENSIONS = ('.png', '.jpg', '.jpeg')


def preview_name(size):
    return 'preview-%dx%d.png' % size


def _libraries():
    """(svg_png, cover, PIL.Image) from setupkit's renderer, or Nones without resvg-py and Pillow."""
    from setupkit.artwork.render import ArtworkError, _libraries, cover, svg_png
    try:
        _, image_module = _libraries()
    except ArtworkError:
        return None, None, None
    return svg_png, cover, image_module


def render_previews(source, out_dir, sizes=PREVIEW_SIZES):
    """Writes one PNG per size (or the copied SVG without the libraries); returns the written paths."""
    os.makedirs(out_dir, exist_ok=True)
    svg_png, cover, image_module = _libraries()
    if svg_png is None:
        target = os.path.join(out_dir, 'preview' + os.path.splitext(source)[1].lower())
        shutil.copyfile(source, target)
        return [target]

    written = []
    for size in sizes:
        if source.lower().endswith('.svg'):
            image = image_module.open(io.BytesIO(svg_png(source, size[0])))
        else:
            image = image_module.open(source)
        path = os.path.join(out_dir, preview_name(size))
        cover(image.convert('RGB'), size, image_module).save(path, format='PNG', optimize=True)
        written.append(path)
    return written


def screenshots(directory):
    """Real client screenshots a person put in catalog/screenshots/<component id>/ (png/jpg)."""
    if not os.path.isdir(directory):
        return []
    names = [name for name in os.listdir(directory) if name.lower().endswith(SCREENSHOT_EXTENSIONS)]
    return sorted(os.path.join(directory, name) for name in names)


def check_previews(component_id, written, shots, video):
    findings = Findings()
    if not written:
        findings.error(component_id, 'no preview image in catalog/catalog.json', 'most_topic')
    elif not all(path.endswith('.png') for path in written):
        message = 'preview copied as SVG: install resvg-py and pillow (uv sync) to render PNGs'
        findings.warn(component_id, message, 'ours')
    if not shots:
        message = 'no client screenshots: add up to %d to catalog/screenshots/%s/' % (MAX_SCREENSHOTS, component_id)
        findings.warn(component_id, message, 'publication_rules')
    elif len(shots) > MAX_SCREENSHOTS:
        message = '%d screenshots, the section allows %d' % (len(shots), MAX_SCREENSHOTS)
        findings.error(component_id, message, 'publication_rules')
    if video is None:
        findings.warn(component_id, 'no preview video: MOST shows a video example per mod', 'most_topic')
    elif not str(video).startswith('https://'):
        findings.error(component_id, 'preview video must be an https:// link', 'ours')
    return findings
