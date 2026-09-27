import unittest

import _support  # noqa: F401
from otmetki.companion.queue_timer import QueueTimer


class QueueTimerTest(unittest.TestCase):

    def test_arena(self):
        timer = QueueTimer()
        timer.enqueued(1, 100.0)
        queue_type, wait = timer.arena_created(142.34)
        self.assertEqual(queue_type, 1)
        self.assertAlmostEqual(wait, 42.34)
        self.assertEqual(timer.take_last_wait(), 42.3)
        self.assertIsNone(timer.take_last_wait())

    def test_dequeued_and_unknown(self):
        timer = QueueTimer()
        self.assertIsNone(timer.dequeued(5))
        timer.enqueued(7, 10)
        self.assertEqual(timer.dequeued(15), (7, 5))
        self.assertIsNone(timer.arena_created(20))
        timer.enqueued(1, 0)
        self.assertIsNone(timer.arena_created(99999))


if __name__ == '__main__':
    unittest.main()
