import glob
import os
import shutil
import struct
import sys
import tempfile
import unittest

BUILD_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if BUILD_DIR not in sys.path:
    sys.path.insert(0, BUILD_DIR)

import layout  # noqa: E402
from setupkit import ASSETS_DIR, CATALOG_PATH  # noqa: E402
from setupkit.artwork import render  # noqa: E402
from setupkit.manifest import catalog as catalog_module  # noqa: E402
from setupkit.manifest.generate import build_manifest  # noqa: E402

try:
    import PIL  # noqa: F401
    import resvg_py  # noqa: F401
    HAVE_LIBRARIES = True
except ImportError:
    HAVE_LIBRARIES = False


def png_size(path):
    with open(path, 'rb') as handle:
        header = handle.read(24)
    assert header[:8] == b'\x89PNG\r\n\x1a\n', path
    return struct.unpack('>II', header[16:24])


class SourcesTest(unittest.TestCase):

    def test_sources_exist(self):
        self.assertTrue(glob.glob(os.path.join(ASSETS_DIR, 'previews', '*.svg')))


@unittest.skipUnless(HAVE_LIBRARIES, 'resvg-py and pillow are not installed (uv sync)')
class RenderTest(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp)

    def test_previews_are_16_by_9(self):
        preview = render.render_preview(os.path.join(ASSETS_DIR, 'previews', 'marks_panel.svg'), os.path.join(self.tmp, 'p.png'))
        self.assertEqual(png_size(preview), render.PREVIEW_SIZE)
        from PIL import Image
        screenshot = os.path.join(self.tmp, 'shot.png')
        Image.new('RGB', (1920, 1200), '#18181b').save(screenshot)
        self.assertEqual(png_size(render.render_preview(screenshot, os.path.join(self.tmp, 'q.png'))), render.PREVIEW_SIZE)

    def test_previews_land_at_the_manifest_paths(self):
        catalog = catalog_module.load(CATALOG_PATH, ASSETS_DIR)
        packages = [package for package in layout.split_packages('root_init.py') if package.key in ('core', 'companion', 'marks_panel')]
        manifest, _ = build_manifest(packages, catalog)
        written = render.render_previews(manifest, catalog, ASSETS_DIR, self.tmp)
        expected = [os.path.join(self.tmp, *component.preview.image.split('/')) for component in manifest.components if component.preview.image]
        self.assertEqual(written, expected)
        self.assertTrue(all(png_size(path) == render.PREVIEW_SIZE for path in written))


if __name__ == '__main__':
    unittest.main()
