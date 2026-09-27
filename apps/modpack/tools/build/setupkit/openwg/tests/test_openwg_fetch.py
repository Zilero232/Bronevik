import hashlib
import io
import os
import shutil
import sys
import tempfile
import unittest
import zipfile

BUILD_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if BUILD_DIR not in sys.path:
    sys.path.insert(0, BUILD_DIR)

from setupkit.openwg import fetch  # noqa: E402


def zip_bytes(members):
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w') as archive:
        for name, data in members.items():
            archive.writestr(name, data)
    return buffer.getvalue()


class FakeOpener(object):
    """urlopen stand-in: serves bytes per URL and counts calls."""

    def __init__(self, payloads):
        self.payloads = payloads
        self.calls = []

    def __call__(self, url):
        self.calls.append(url)
        return io.BytesIO(self.payloads[url])


class FetchTest(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp)

    def test_download_checks_the_hash_and_caches(self):
        target = os.path.join(self.tmp, 'cache', 'file.bin')
        opener = FakeOpener({'https://x/file': b'payload'})
        digest = hashlib.sha256(b'payload').hexdigest()
        fetch.download('https://x/file', target, digest, opener)
        fetch.download('https://x/file', target, digest, opener)
        self.assertEqual(len(opener.calls), 1)
        with self.assertRaises(fetch.FetchError):
            fetch.download('https://x/file', os.path.join(self.tmp, 'other.bin'), '0' * 64, opener)
        self.assertEqual(sorted(os.listdir(self.tmp)), ['cache'])

    def test_extract_takes_only_the_pinned_members(self):
        archive = os.path.join(self.tmp, 'owg.zip')
        with open(archive, 'wb') as handle:
            handle.write(zip_bytes({'bin/openwg.utils.x86_32.dll': b'dll', 'innosetup/openwg.utils.iss': b'iss', 'bin/other.exe': b'exe'}))
        out = os.path.join(self.tmp, 'out')
        fetch.extract(archive, out)
        self.assertEqual(sorted(os.listdir(out)), ['bin', 'openwg.utils.iss'])
        self.assertEqual(os.listdir(os.path.join(out, 'bin')), ['openwg.utils.x86_32.dll'])
        with open(archive, 'wb') as handle:
            handle.write(zip_bytes({'bin/openwg.utils.x86_32.dll': b'dll'}))
        with self.assertRaises(fetch.FetchError):
            fetch.extract(archive, out)

    def test_pins(self):
        self.assertTrue(fetch.ZIP_URL.startswith('https://gitlab.com/'))
        self.assertIn(fetch.RELEASE, fetch.ZIP_URL)
        self.assertEqual(len(fetch.ZIP_SHA256), 64)
        self.assertEqual(len(fetch.LICENSE_SHA256), 64)


if __name__ == '__main__':
    unittest.main()
