import os
import shutil
import struct
import sys
import tempfile
import unittest

PY3 = sys.version_info[0] >= 3
TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if PY3:
    if TOOLS_DIR not in sys.path:
        sys.path.insert(0, TOOLS_DIR)
    from most import previews
    from most.rules import MAX_SCREENSHOTS, PREVIEW_SIZES
    from setupkit import ASSETS_DIR

try:
    import PIL  # noqa: F401
    import resvg_py  # noqa: F401
    HAVE_LIBRARIES = True
except ImportError:
    HAVE_LIBRARIES = False


def png_size(path):
    with open(path, 'rb') as handle:
        header = handle.read(24)
    return struct.unpack('>II', header[16:24])


@unittest.skipUnless(PY3, 'the MOST bundler needs Python 3')
class PreviewsTest(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp)
        self.source = os.path.join(ASSETS_DIR, 'previews', 'marks_panel.svg')

    @unittest.skipUnless(HAVE_LIBRARIES, 'resvg-py and pillow are not installed (uv sync)')
    def test_renders_every_size(self):
        written = previews.render_previews(self.source, self.tmp)
        self.assertEqual([png_size(path) for path in written], list(PREVIEW_SIZES))

    @unittest.skipIf(HAVE_LIBRARIES, 'the fallback runs without resvg-py and pillow')
    def test_copies_the_svg_without_libraries(self):
        written = previews.render_previews(self.source, self.tmp)
        self.assertEqual([os.path.basename(path) for path in written], ['preview.svg'])
        self.assertEqual(len(previews.check_previews('x', written, [], 'https://v').warnings), 2)

    def test_screenshot_and_video_rules(self):
        shots = ['%d.png' % index for index in range(MAX_SCREENSHOTS + 1)]
        findings = previews.check_previews('x', ['a.png'], shots, 'http://insecure')
        self.assertEqual(len(findings.errors), 2)
        findings = previews.check_previews('x', [], [], None)
        self.assertEqual(len(findings.errors), 1)
        self.assertEqual(len(findings.warnings), 2)
        self.assertEqual(previews.check_previews('x', ['a.png'], ['1.png'], 'https://v').items, [])

    def test_screenshots_lists_images_only(self):
        for name in ('b.png', 'a.JPG', 'notes.txt'):
            open(os.path.join(self.tmp, name), 'w').close()
        self.assertEqual([os.path.basename(path) for path in previews.screenshots(self.tmp)], ['a.JPG', 'b.png'])
        self.assertEqual(previews.screenshots(os.path.join(self.tmp, 'missing')), [])


if __name__ == '__main__':
    unittest.main()
