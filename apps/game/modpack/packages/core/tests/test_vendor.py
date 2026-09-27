from __future__ import absolute_import, division, print_function, unicode_literals

import os
import sys
import unittest

import _support
from otmetki.core.vendor import VENDORED, attr, blinker, six
from otmetki.core.vendor.enum34 import Enum, IntEnum

VENDOR_SCRIPT = os.path.join(_support.MODPACK_DIR, 'tools', 'vendor', 'vendor.py')


def pins():
    import importlib.util
    spec = importlib.util.spec_from_file_location('otmetki_vendor_script', VENDOR_SCRIPT)
    script = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(script)
    return script.PINS


class VendorTest(unittest.TestCase):

    def test_versions(self):
        self.assertEqual(six.__version__, VENDORED['six'])
        self.assertEqual(blinker.__version__, VENDORED['blinker'])
        self.assertEqual(attr.__version__, VENDORED['attrs'])
        self.assertEqual(set(VENDORED), set(['six', 'blinker', 'attrs', 'enum34']))

    @unittest.skipIf(sys.version_info[0] < 3, 'the vendoring script is Python 3 tooling')
    def test_versions_match_the_pins(self):
        self.assertEqual(dict((pin[0], pin[1]) for pin in pins()), VENDORED)

    def test_every_library_ships_its_licence(self):
        for name in VENDORED:
            path = os.path.join(_support.VENDOR_DIR, 'licenses', name + '.txt')
            self.assertTrue(os.path.isfile(path) and os.path.getsize(path) > 0, path)

    def test_libraries_work_under_the_game_package_name(self):
        self.assertTrue(six.moves.queue.Queue)
        self.assertTrue(six.moves.urllib.request.urlopen)

        class Color(Enum):
            RED = 'red'

        self.assertIs(Color('red'), Color.RED)
        self.assertEqual(IntEnum('Shell', [('AP', 1)]).AP, 1)

        @attr.s
        class Point(object):
            x = attr.ib()
            y = attr.ib(default=0)

        self.assertEqual(attr.asdict(Point(1)), {'x': 1, 'y': 0})
        signal = blinker.Namespace().signal('x')
        received = []
        signal.connect(received.append, weak=False)
        signal.send('sender')
        self.assertEqual(received, ['sender'])


if __name__ == '__main__':
    unittest.main()
