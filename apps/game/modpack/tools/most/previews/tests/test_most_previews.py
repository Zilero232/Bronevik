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
        self.source = os.path.join(ASSETS_DIR, 'previews', 'camera.svg')

    @unittest.skipUnless(HAVE_LIBRARIES, 'resvg-py and pillow are not installed (uv sync)')
    def test_renders_every_size(self):
        written = previews.render_previews(self.source, self.tmp)

        self.assertEqual([png_size(path) for path in written], list(PREVIEW_SIZES))

    @unittest.skipIf(HAVE_LIBRARIES, 'the fallback runs without resvg-py and pillow')
    def test_copies_the_svg_without_libraries(self):
        written = previews.render_previews(self.source, self.tmp)

        self.assertEqual([os.path.basename(path) for path in written], ['preview.svg'])
        self.assertEqual(len(previews.check_previews('x', written, [], 'https://v').warnings), 2)

    def test_too_many_screenshots_and_an_http_video_are_errors(self):
        shots = ['%d.png' % index for index in range(MAX_SCREENSHOTS + 1)]

        findings = previews.check_previews('x', ['a.png'], shots, 'http://insecure')

        self.assertEqual(len(findings.errors), 2)

    def test_no_preview_is_an_error_and_no_screenshots_or_video_are_warnings(self):
        findings = previews.check_previews('x', [], [], None)

        self.assertEqual(len(findings.errors), 1)
        self.assertEqual(len(findings.warnings), 2)

    def test_a_png_preview_a_screenshot_and_an_https_video_pass(self):
        findings = previews.check_previews('x', ['a.png'], ['1.png'], 'https://v')

        self.assertEqual(findings.items, [])

    def test_screenshots_lists_images_only(self):
        for name in ('b.png', 'a.JPG', 'notes.txt'):
            open(os.path.join(self.tmp, name), 'w').close()

        shots = previews.screenshots(self.tmp)

        self.assertEqual([os.path.basename(path) for path in shots], ['a.JPG', 'b.png'])

    def test_screenshots_of_a_missing_folder_are_none(self):
        shots = previews.screenshots(os.path.join(self.tmp, 'missing'))

        self.assertEqual(shots, [])


if __name__ == '__main__':
    unittest.main()
