from __future__ import absolute_import, division, print_function, unicode_literals

import io
import sys
import unittest

import _support  # noqa: F401
from otmetki.core import log
from otmetki.core.log.limiter import RepeatLimiter
from otmetki.core.shells import shell_code, shell_name


class Clock(object):

    def __init__(self):
        self.now = 1000.0

    def __call__(self):
        return self.now


class RepeatLimiterTest(unittest.TestCase):

    def test_first_then_counted_per_window(self):
        clock = Clock()
        limiter = RepeatLimiter(clock, window_s=60, max_tracked=10)
        assert limiter.admit('a') == (True, 0)
        assert [limiter.admit('a') for _ in range(3)] == [(False, 0)] * 3
        assert limiter.admit('b') == (True, 0)
        clock.now += 61
        assert limiter.admit('a') == (True, 3)
        assert limiter.admit('a') == (False, 0)

    def test_tracks_a_bounded_number_of_keys(self):
        clock = Clock()
        limiter = RepeatLimiter(clock, window_s=60, max_tracked=2)
        limiter.admit('a')
        clock.now += 1
        limiter.admit('b')
        clock.now += 1
        limiter.admit('c')
        assert sorted(limiter.seen) == ['b', 'c']


class LogExceptionTest(unittest.TestCase):

    def setUp(self):
        self.saved = sys.stdout, log._repeats
        self.clock = Clock()
        log._repeats = RepeatLimiter(self.clock)
        sys.stdout = self.out = io.StringIO() if sys.version_info[0] >= 3 else io.BytesIO()

    def tearDown(self):
        sys.stdout, log._repeats = self.saved

    def broken(self):
        return 1 // 0

    def test_identical_tracebacks_are_written_once_per_window(self):
        handler = log.safe(self.broken)
        for _ in range(50):
            handler()
        text = self.out.getvalue()
        assert text.count('Traceback') == 1
        self.clock.now += 61
        handler()
        text = self.out.getvalue()
        assert text.count('Traceback') == 2
        assert 'repeated 49 more times' in text


class ShellTypesTest(unittest.TestCase):

    def test_every_battle_log_shell_type_of_the_client(self):
        # RU 1.45 client source, common/constants.py BATTLE_LOG_SHELL_TYPES: 0..14.
        assert shell_name(14) == 'HE_MODERN_DF'
        assert shell_code(14) == 'he'
        assert shell_name(15) is None


if __name__ == '__main__':
    unittest.main()
