from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.companion.binding import Credentials
from otmetki.core.codec import decode_json, parse_retry_after
from otmetki.companion.outbox import MAX_BACKOFF_S, Outbox, Outcome, classify_status
from otmetki.companion.sender import IngestSender
from otmetki.core.net.signing import DEVICE_HEADER, verify_request
from otmetki.core.storage import MemoryFile


def event(index):
    return {'type': 'queue', 'event_id': 'e%d' % index, 'occurred_at': index}


def outbox(**kwargs):
    return Outbox(MemoryFile(), rng=lambda: 0.5, **kwargs)


class OutboxTest(unittest.TestCase):

    def test_classify(self):
        self.assertEqual(classify_status(200), Outcome.SENT)
        self.assertEqual(classify_status(409), Outcome.SENT)
        self.assertEqual(classify_status(401), Outcome.AUTH)
        self.assertEqual(classify_status(403), Outcome.AUTH)
        self.assertEqual(classify_status(413), Outcome.SHRINK)
        self.assertEqual(classify_status(422), Outcome.DROP)
        self.assertEqual(classify_status(0), Outcome.RETRY)
        self.assertEqual(classify_status(503), Outcome.RETRY)
        self.assertEqual(classify_status(429), Outcome.RETRY)

    def test_batches_and_dedupe(self):
        box = outbox(max_batch=2)
        self.assertTrue(box.enqueue(event(1)))
        self.assertFalse(box.enqueue(event(1)))
        box.enqueue(event(2))
        box.enqueue(event(3))
        batch = box.next_batch(0)
        self.assertEqual([e['event_id'] for e in batch], ['e1', 'e2'])
        self.assertEqual(box.complete(batch, 200, 0), Outcome.SENT)
        self.assertEqual([e['event_id'] for e in box.next_batch(0)], ['e3'])

    def test_capacity_drops_oldest(self):
        box = outbox(max_events=3)
        for index in range(5):
            box.enqueue(event(index))
        self.assertEqual([e['event_id'] for e in box.events], ['e2', 'e3', 'e4'])
        self.assertEqual(box.dropped, 2)

    def test_exponential_backoff(self):
        box = outbox()
        box.enqueue(event(1))
        batch = box.next_batch(100)
        self.assertEqual(box.complete(batch, 500, 100), Outcome.RETRY)
        self.assertEqual(box.retry_at, 105.0)
        self.assertIsNone(box.next_batch(104))
        self.assertIsNotNone(box.next_batch(105))
        box.complete(batch, 0, 105)
        self.assertEqual(box.retry_at, 115.0)
        for _ in range(20):
            box.complete(batch, 502, 0)
        self.assertEqual(box.retry_at, MAX_BACKOFF_S)
        box.complete(batch, 200, 0)
        self.assertEqual(box.attempt, 0)
        self.assertEqual(len(box), 0)

    def test_retry_after(self):
        box = outbox()
        box.enqueue(event(1))
        box.complete(box.next_batch(0), 429, 0, retry_after=120)
        self.assertEqual(box.retry_at, 120.0)

    def test_drop_invalid(self):
        box = outbox()
        box.enqueue(event(1))
        self.assertEqual(box.complete(box.next_batch(0), 422, 0), Outcome.DROP)
        self.assertEqual(len(box), 0)
        self.assertEqual(box.dropped, 1)

    def test_auth_blocks_until_unblocked(self):
        box = outbox()
        box.enqueue(event(1))
        box.complete(box.next_batch(0), 401, 0)
        self.assertIsNone(box.next_batch(1000))
        self.assertEqual(len(box), 1)
        box.unblock()
        self.assertIsNotNone(box.next_batch(1000))

    def test_shrink_on_413(self):
        box = outbox(max_batch=4)
        for index in range(4):
            box.enqueue(event(index))
        box.complete(box.next_batch(0), 413, 0)
        self.assertEqual(len(box.next_batch(0)), 2)
        box.complete(box.next_batch(0), 413, 0)
        single = box.next_batch(0)
        self.assertEqual(len(single), 1)
        box.complete(single, 413, 0)
        self.assertEqual(len(box), 3)

    def test_persistence(self):
        storage = MemoryFile()
        box = Outbox(storage)
        box.enqueue(event(1))
        box.enqueue(event(2))
        restored = Outbox(storage)
        self.assertEqual([e['event_id'] for e in restored.events], ['e1', 'e2'])
        self.assertEqual(Outbox(MemoryFile({'events': 'garbage'})).events, [])


class SenderTest(unittest.TestCase):

    def setUp(self):
        self.creds = Credentials('dev_1', 's' * 43, 42)
        self.box = outbox()
        self.transport = _support.FakeTransport()
        self.responses = []
        self.auth_failures = []
        self.sender = IngestSender(
            self.box, self.creds, self.transport, 'https://api.example/mod/ingest', '0.1.0', '1.45.0', 'ua',
            on_response=self.responses.append, on_auth_failed=lambda: self.auth_failures.append(True), clock=lambda: 50.0,
        )

    def test_signed_batch(self):
        self.box.enqueue(event(1))
        self.assertTrue(self.sender.tick(10))
        request = self.transport.requests[0]
        self.assertEqual(request['method'], 'POST')
        self.assertEqual(request['headers'][DEVICE_HEADER], 'dev_1')
        self.assertTrue(verify_request(self.creds.secret, 'POST', 'https://api.example/mod/ingest', request['headers'], request['body']))
        envelope = decode_json(request['body'])
        self.assertEqual(envelope['account_id'], 42)
        self.assertEqual(envelope['device_id'], 'dev_1')
        self.assertEqual(envelope['sent_at'], 10)
        self.assertEqual([e['event_id'] for e in envelope['events']], ['e1'])

    def test_single_flight_and_ack(self):
        self.box.enqueue(event(1))
        self.sender.tick(0)
        self.box.enqueue(event(2))
        self.assertFalse(self.sender.tick(1))
        self.transport.respond(200, b'{"accepted":1,"session":{"session_id":"s","wn8":1500}}')
        self.assertEqual(self.responses, [{'accepted': 1, 'session': {'session_id': 's', 'wn8': 1500}}])
        self.assertEqual([e['event_id'] for e in self.box.events], ['e2'])
        self.assertTrue(self.sender.tick(2))

    def test_auth_failure_callback(self):
        self.box.enqueue(event(1))
        self.sender.tick(0)
        self.transport.respond(401, b'{"error":"bad_signature"}')
        self.assertEqual(self.auth_failures, [True])
        self.assertFalse(self.sender.tick(1000))

    def test_retry_uses_clock_and_header(self):
        self.box.enqueue(event(1))
        self.sender.tick(0)
        self.transport.respond(429, b'', {'Retry-After': '90'})
        self.assertEqual(self.box.retry_at, 140.0)

    def test_no_credentials_no_send(self):
        self.sender.credentials = None
        self.box.enqueue(event(1))
        self.assertFalse(self.sender.tick(0))
        self.assertEqual(self.transport.requests, [])

    def test_parse_retry_after(self):
        self.assertEqual(parse_retry_after({'retry-after': ' 5 '}), 5.0)
        self.assertIsNone(parse_retry_after({'Retry-After': 'Wed, 21 Oct 2015'}))
        self.assertIsNone(parse_retry_after(None))


if __name__ == '__main__':
    unittest.main()
