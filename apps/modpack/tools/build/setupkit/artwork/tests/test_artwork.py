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

from setupkit import ASSETS_DIR  # noqa: E402
from setupkit.artwork import render  # noqa: E402

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
        self.assertTrue(os.path.isfile(os.path.join(ASSETS_DIR, 'branding', 'wizard.svg')))
        self.assertTrue(os.path.isfile(render.SITE_ICON), 'the setup icon reuses the site icon')
        self.assertTrue(glob.glob(os.path.join(ASSETS_DIR, 'previews', '*.svg')))


@unittest.skipUnless(HAVE_LIBRARIES, 'resvg-py and pillow are not installed (uv sync)')
class RenderTest(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp)

    def test_wizard_images_follow_the_dpi_steps(self):
        images = render.render_wizard(os.path.join(ASSETS_DIR, 'branding', 'wizard.svg'), self.tmp)
        self.assertEqual([png_size(path)[0] for path in images], list(render.WIZARD_WIDTHS))
        width, height = png_size(images[0])
        self.assertAlmostEqual(float(height) / width, 314.0 / 164, places=1)

    def test_small_images_and_icon(self):
        images = render.render_small(render.SITE_ICON, self.tmp)
        self.assertEqual([png_size(path) for path in images], [(size, size) for size in render.SMALL_SIZES])
        icon = render.render_icon(render.SITE_ICON, os.path.join(self.tmp, 'setup.ico'))
        with open(icon, 'rb') as handle:
            reserved, kind, count = struct.unpack('<HHH', handle.read(6))
        self.assertEqual((reserved, kind, count), (0, 1, len(render.ICON_SIZES)))

    def test_previews_are_16_by_9(self):
        preview = render.render_preview(os.path.join(ASSETS_DIR, 'previews', 'marks_panel.svg'), os.path.join(self.tmp, 'p.png'))
        self.assertEqual(png_size(preview), render.PREVIEW_SIZE)
        from PIL import Image
        screenshot = os.path.join(self.tmp, 'shot.png')
        Image.new('RGB', (1920, 1200), '#18181b').save(screenshot)
        self.assertEqual(png_size(render.render_preview(screenshot, os.path.join(self.tmp, 'q.png'))), render.PREVIEW_SIZE)


if __name__ == '__main__':
    unittest.main()
