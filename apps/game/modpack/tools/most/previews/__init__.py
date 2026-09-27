"""Preview images for a submission, rendered from the catalog's preview (installer/assets/previews/*.svg).

The SVG goes through setupkit's resvg renderer (tools/build/setupkit/artwork) and is cover-cropped to each
of PREVIEW_SIZES with Pillow, the way the installer's 640x360 previews are. Without resvg-py and Pillow
(`uv sync` in apps/game/modpack) the SVG is copied as is and the bundle carries a warning.
"""
import io
import os
import shutil

from most.rules import MAX_SCREENSHOTS, PREVIEW_SIZES, Findings


def preview_name(size):
    return 'preview-%dx%d.png' % size


def _libraries():
    from setupkit.artwork.render import ArtworkError, _libraries, svg_png
    try:
        _, image_module = _libraries()
    except ArtworkError:
        return None, None
    return svg_png, image_module


def cover(image, size, image_module):
    """Scale to cover `size`, then centre-crop to it."""
    width, height = size
    scale = max(float(width) / image.width, float(height) / image.height)
    image = image.resize((max(width, int(round(image.width * scale))), max(height, int(round(image.height * scale)))), image_module.LANCZOS)
    left, top = (image.width - width) // 2, (image.height - height) // 2
    return image.crop((left, top, left + width, top + height))


def render_previews(source, out_dir, sizes=PREVIEW_SIZES):
    """Writes one PNG per size (or the copied SVG without the libraries); returns the written paths."""
    os.makedirs(out_dir, exist_ok=True)
    svg_png, image_module = _libraries()
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
    """Real client screenshots a person put in installer/assets/screenshots/<component id>/ (png/jpg)."""
    if not os.path.isdir(directory):
        return []
    return sorted(os.path.join(directory, name) for name in os.listdir(directory) if name.lower().endswith(('.png', '.jpg', '.jpeg')))


def check_previews(component_id, written, shots, video):
    findings = Findings()
    if not written:
        findings.error(component_id, 'no preview image in installer/catalog/catalog.json', 'most_topic')
    elif not all(path.endswith('.png') for path in written):
        findings.warn(component_id, 'preview copied as SVG: install resvg-py and pillow (uv sync) to render PNGs', 'ours')
    if not shots:
        message = 'no client screenshots: add up to %d to installer/assets/screenshots/%s/' % (MAX_SCREENSHOTS, component_id)
        findings.warn(component_id, message, 'publication_rules')
    elif len(shots) > MAX_SCREENSHOTS:
        findings.error(component_id, '%d screenshots, the section allows %d' % (len(shots), MAX_SCREENSHOTS), 'publication_rules')
    if video is None:
        findings.warn(component_id, 'no preview video: MOST shows a video example per mod', 'most_topic')
    elif not str(video).startswith('https://'):
        findings.error(component_id, 'preview video must be an https:// link', 'ours')
    return findings
