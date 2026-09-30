# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import os
import shutil
import tempfile
import unittest

import _support  # noqa: F401
from otmetki.core.log.logfile import LogFile, rotate

T0 = 1790000000.25


def read(path):
    with io.open(path, encoding='utf-8') as handle:
        return handle.read().splitlines()


class LogFileTest(unittest.TestCase):

    def setUp(self):
        self.root = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.root)
        self.path = os.path.join(self.root, 'configs', 'otmetki.log')

    def test_lines_before_open_follow_the_header(self):
        logfile = LogFile(clock=lambda: T0)
        logfile.write('early')
        assert logfile.open(self.path, ['header 1', 'header 2'])
        logfile.write(u'позже')
        lines = read(self.path)
        assert [line.split(' ', 2)[2] for line in lines] == ['header 1', 'header 2', 'early', u'позже']
        assert lines[0].split(' ')[1].endswith('.250')

    def test_bytes_lines_with_broken_utf8_are_kept(self):
        logfile = LogFile(clock=lambda: T0)
        logfile.open(self.path, [])
        logfile.write(b'path \xcf\xf3\xf2\xfc')
        line = read(self.path)[0]
        assert line.split(' ', 2)[2].startswith('path ') and u'�' in line

    def test_each_session_shifts_the_older_files_and_keeps_three(self):
        for session in range(5):
            logfile = LogFile(clock=lambda: T0, keep=3)
            logfile.open(self.path, ['session %d' % session])
        names = sorted(os.listdir(os.path.dirname(self.path)))
        assert names == ['otmetki.1.log', 'otmetki.2.log', 'otmetki.log']
        assert read(self.path)[0].endswith('session 4')
        assert read(os.path.join(self.root, 'configs', 'otmetki.2.log'))[0].endswith('session 2')

    def test_a_session_past_the_size_limit_starts_a_new_file(self):
        logfile = LogFile(clock=lambda: T0, keep=3, max_bytes=200)
        logfile.open(self.path, ['header'])
        for index in range(10):
            logfile.write('line %d %s' % (index, 'x' * 40))
        assert os.path.getsize(self.path) <= 200
        assert read(self.path)[-1].split(' ', 2)[2].startswith('line 9')
        assert len(os.listdir(os.path.dirname(self.path))) == 3

    def test_held_lines_are_bounded_and_a_disk_error_stops_the_file(self):
        logfile = LogFile(clock=lambda: T0, pending_lines=2)
        for index in range(5):
            logfile.write('line %d' % index)
        assert len(logfile.pending) == 2
        blocker = os.path.join(self.root, 'file')
        with open(blocker, 'w') as handle:
            handle.write('')
        assert not logfile.open(os.path.join(blocker, 'otmetki.log'), ['header'])
        logfile.write('ignored')
        assert logfile.failed

    def test_rotate_without_files_does_nothing(self):
        rotate(self.path, 3)
        assert not os.path.exists(os.path.dirname(self.path))


if __name__ == '__main__':
    unittest.main()
