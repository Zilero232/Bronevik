"""SVG sources -> the installer's images, rendered with resvg (resvg-py) and packed with Pillow.

    installer/assets/branding/wizard.svg  -> artwork/wizard-<w>.png, one per Inno DPI step (WizardImageFile)
    apps/client/app/icon.svg (site icon)  -> artwork/small-<s>.png (WizardSmallImageFile) and artwork/setup.ico
    catalog preview .svg / .png           -> previews/<component id>.png, 640x360

Inno picks the image that best matches the DPI from the wildcard lists in setup.iss.
"""
import io
import os

from .. import MODPACK_DIR

# Image-area sizes Inno 6.6+ uses at 100..250 % DPI (WizardImageFile / WizardSmallImageFile docs).
WIZARD_WIDTHS = (202, 269, 336, 403, 430, 498, 534)
SMALL_SIZES = (58, 77, 97, 116, 124, 143, 159)
ICON_SIZES = (16, 20, 24, 32, 40, 48, 64, 128, 256)
PREVIEW_SIZE = (640, 360)
SITE_ICON = os.path.join(os.path.dirname(MODPACK_DIR), 'client', 'app', 'icon.svg')


class ArtworkError(RuntimeError):
    pass


def _libraries():
    try:
        import resvg_py
        from PIL import Image
    except ImportError as error:
        raise ArtworkError('artwork needs resvg-py and pillow (uv sync in apps/modpack): %s' % error)
    return resvg_py, Image


def svg_png(svg_path, width):
    resvg_py, _ = _libraries()
    return bytes(resvg_py.svg_to_bytes(svg_path=svg_path, width=width))


def _write(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as handle:
        handle.write(data)
    return path


def render_wizard(svg_path, out_dir):
    return [_write(os.path.join(out_dir, 'wizard-%d.png' % width), svg_png(svg_path, width)) for width in WIZARD_WIDTHS]


def render_small(svg_path, out_dir):
    return [_write(os.path.join(out_dir, 'small-%d.png' % size), svg_png(svg_path, size)) for size in SMALL_SIZES]


def render_icon(svg_path, out_path):
    _, Image = _libraries()
    image = Image.open(io.BytesIO(svg_png(svg_path, max(ICON_SIZES)))).convert('RGBA')
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    image.save(out_path, format='ICO', sizes=[(size, size) for size in ICON_SIZES])
    return out_path


def render_preview(source, out_path):
    """An SVG renders at 640 px wide; a PNG screenshot is scaled and centre-cropped to 640x360."""
    _, Image = _libraries()
    if source.lower().endswith('.svg'):
        image = Image.open(io.BytesIO(svg_png(source, PREVIEW_SIZE[0])))
    else:
        image = Image.open(source)
    image = image.convert('RGB')
    width, height = PREVIEW_SIZE
    scale = max(float(width) / image.width, float(height) / image.height)
    image = image.resize((max(width, round(image.width * scale)), max(height, round(image.height * scale))), Image.LANCZOS)
    left, top = (image.width - width) // 2, (image.height - height) // 2
    image = image.crop((left, top, left + width, top + height))
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    image.save(out_path, format='PNG', optimize=True)
    return out_path


def render_all(manifest, catalog, assets_dir, out_dir):
    """Every image the installer needs; returns the written paths."""
    artwork = os.path.join(out_dir, 'artwork')
    written = render_wizard(os.path.join(assets_dir, 'branding', 'wizard.svg'), artwork)
    written += render_small(SITE_ICON, artwork)
    written.append(render_icon(SITE_ICON, os.path.join(artwork, 'setup.ico')))
    for component in manifest.components:
        if component.preview.image:
            source = os.path.join(assets_dir, catalog.entry(component.id).preview.image)
            written.append(render_preview(source, os.path.join(out_dir, *component.preview.image.split('/'))))
    return written
