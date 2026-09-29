from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.packaging import mixed_install


class MixedInstallTest(unittest.TestCase):

    def test_split_set_alone_is_fine(self):
        names = ['net.triotmetki.core_0.3.0.mtmod', 'otmetki.companion_0.3.0.mtmod', 'net.triotmetki.ui_0.1.2.mtmod',
                 'net.openwg.gameface_1.2.2.mtmod']
        self.assertIsNone(mixed_install(names))

    def test_single_alone_is_fine(self):
        self.assertIsNone(mixed_install(['otmetki.0.1.1.mtmod', 'gambiter.guiflash_0.6.6.mtmod']))

    def test_both_formats_are_reported(self):
        found = mixed_install(['otmetki.0.1.1.mtmod', 'net.triotmetki.core_0.3.0.mtmod', 'otmetki.companion_0.3.0.mtmod'])
        self.assertEqual(found, (['otmetki.0.1.1.mtmod'], ['net.triotmetki.core_0.3.0.mtmod', 'otmetki.companion_0.3.0.mtmod']))


if __name__ == '__main__':
    unittest.main()
