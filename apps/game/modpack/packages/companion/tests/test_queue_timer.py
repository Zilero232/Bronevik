from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.companion.queue_timer import QueueTimer


def queued_timer(queue_type, at):
    timer = QueueTimer()
    timer.enqueued(queue_type, at)
    return timer


class QueueTimerTest(unittest.TestCase):

    def test_arena_created_returns_the_queue_type_and_the_wait(self):
        timer = queued_timer(1, 100.0)

        queue_type, wait = timer.arena_created(142.34)

        self.assertEqual(queue_type, 1)
        self.assertAlmostEqual(wait, 42.34)

    def test_the_last_wait_is_rounded_and_taken_once(self):
        timer = queued_timer(1, 100.0)
        timer.arena_created(142.34)

        first = timer.take_last_wait()
        second = timer.take_last_wait()

        self.assertEqual(first, 42.3)
        self.assertIsNone(second)

    def test_dequeued_without_a_queue_has_no_wait(self):
        self.assertIsNone(QueueTimer().dequeued(5))

    def test_dequeued_returns_the_queue_type_and_the_wait(self):
        timer = queued_timer(7, 10)

        self.assertEqual(timer.dequeued(15), (7, 5))

    def test_dequeued_ends_the_queue(self):
        timer = queued_timer(7, 10)
        timer.dequeued(15)

        self.assertIsNone(timer.arena_created(20))

    def test_an_implausibly_long_wait_is_dropped(self):
        timer = queued_timer(1, 0)

        self.assertIsNone(timer.arena_created(99999))


if __name__ == '__main__':
    unittest.main()
