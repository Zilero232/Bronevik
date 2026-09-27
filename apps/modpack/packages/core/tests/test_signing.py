import unittest

import time

import _support
from otmetki.core.net import signing
from otmetki.core.net.signing import (DEVICE_HEADER, NONCE_HEADER, SERVER_TIME_HEADER, SIGNATURE_HEADER, STALE_REQUEST_STATUS, TIMESTAMP_HEADER,
                             clock_offset, request_path, server_time, sign, signed_headers, signed_message, signed_request, sync_clock,
                             verify, verify_request)


# The same vector is asserted by apps/server/src/modules/mod/lib/request-signature/_tests/request-signature.test.ts.
SERVER_SIGNATURE_VECTOR = '7c6576dee0e349dfbd5997cdc94ebf348ddd00ff669762e869f89074eb845078'


class SigningTest(unittest.TestCase):

    def test_rfc4231_case_2(self):
        self.assertEqual(
            sign('Jefe', 'what do ya want for nothing?'),
            'sha256=5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843',
        )

    def test_text_and_bytes_give_same_signature(self):
        self.assertEqual(sign(u'secret', u'{"a":1}'), sign(b'secret', b'{"a":1}'))

    def test_verify(self):
        body = b'{"events":[]}'
        signature = sign('k' * 32, body)
        self.assertTrue(verify('k' * 32, body, signature))
        self.assertFalse(verify('k' * 32, body + b' ', signature))
        self.assertFalse(verify('x' * 32, body, signature))

    def test_signed_headers(self):
        headers = signed_headers('dev-1', 's' * 40, b'{}', 'otmetki.companion/0.1.0', 'POST', 'https://api.example/mod/ingest?x=1',
                                 now=1790000000.7, nonce='n' * 32)
        self.assertEqual(headers[DEVICE_HEADER], 'dev-1')
        self.assertEqual(headers[TIMESTAMP_HEADER], '1790000000')
        self.assertEqual(headers[NONCE_HEADER], 'n' * 32)
        expected = sign('s' * 40, b'v2\nPOST\n/mod/ingest\n1790000000\n' + b'n' * 32 + b'\n{}')
        self.assertEqual(headers[SIGNATURE_HEADER], expected)
        self.assertEqual(headers['Content-Type'], 'application/json')

    def test_signature_binds_the_path(self):
        headers = signed_headers('dev-1', 's' * 40, b'{}', 'ua', 'POST', 'https://api.example/mod/ingest')
        self.assertTrue(verify_request('s' * 40, 'POST', 'https://api.example/mod/ingest', headers, b'{}'))
        self.assertFalse(verify_request('s' * 40, 'POST', 'https://api.example/mod/settings', headers, b'{}'))

    def test_every_request_gets_a_fresh_nonce(self):
        first = signed_headers('dev-1', 's' * 40, b'{}', 'ua', 'POST', 'https://api.example/mod/ingest')
        second = signed_headers('dev-1', 's' * 40, b'{}', 'ua', 'POST', 'https://api.example/mod/ingest')
        self.assertNotEqual(first[NONCE_HEADER], second[NONCE_HEADER])
        self.assertTrue(16 <= len(first[NONCE_HEADER]) <= 64)

    def test_request_path(self):
        self.assertEqual(request_path('https://api.example/mod/settings/apply/7/result?a=1'), '/mod/settings/apply/7/result')
        self.assertEqual(request_path('http://localhost:4000'), '/')
        self.assertEqual(request_path('https://api.example/mod/ingest#frag'), '/mod/ingest')
        self.assertEqual(signed_message('post', '/p', 5, 'n', b'x'), b'v2\nPOST\n/p\n5\nn\nx')

    def test_signed_header_lines_sit_between_the_nonce_and_the_body(self):
        self.assertEqual(signed_message('POST', '/p', 5, 'n', b'x', [('X-Otmetki-Visibility', 'public')]),
                         b'v2\nPOST\n/p\n5\nn\nx-otmetki-visibility:public\nx')
        self.assertEqual(signed_message('POST', '/p', 5, 'n', b'x', []), signed_message('POST', '/p', 5, 'n', b'x'))

    def test_signed_headers_are_sent_and_covered(self):
        extra = [('X-Otmetki-Visibility', 'public')]
        headers = signed_headers('dev-1', 's' * 40, b'REPLAY', 'ua', 'POST', 'https://api.example/replays/mod', now=1790000000,
                                 nonce='n' * 32, content_type='multipart/form-data', extra_headers=extra)
        self.assertEqual(headers['X-Otmetki-Visibility'], 'public')
        self.assertEqual(headers[SIGNATURE_HEADER], 'sha256=' + SERVER_SIGNATURE_VECTOR)
        self.assertTrue(verify_request('s' * 40, 'POST', 'https://api.example/replays/mod', headers, b'REPLAY', ('X-Otmetki-Visibility',)))
        self.assertFalse(verify_request('s' * 40, 'POST', 'https://api.example/replays/mod', headers, b'REPLAY'))


class ClockSkewTest(unittest.TestCase):

    def tearDown(self):
        signing._clock['offset'] = 0.0

    def request(self, transport, calls):
        signed_request(transport, 'POST', 'https://api.example/mod/ingest', 'dev-1', 's' * 40, b'{}', 'ua', lambda *a: calls.append(a))

    def test_server_time_prefers_the_explicit_header(self):
        self.assertEqual(server_time({'x-otmetki-server-time': '1790000000', 'Date': 'Thu, 01 Jan 1970 00:00:00 GMT'}), 1790000000.0)

    def test_server_time_falls_back_to_the_date_header(self):
        self.assertEqual(server_time({'Date': 'Sun, 27 Sep 2026 10:00:00 GMT'}), 1790503200.0)

    def test_server_time_is_none_without_a_usable_header(self):
        self.assertIsNone(server_time({'Date': 'garbage'}))
        self.assertIsNone(server_time(None))

    def test_sync_clock_shifts_every_later_timestamp(self):
        self.assertTrue(sync_clock({SERVER_TIME_HEADER: '1790000600'}, now=1790000000.0))
        self.assertEqual(clock_offset(), 600.0)
        headers = signed_headers('dev-1', 's' * 40, b'{}', 'ua', 'POST', 'https://api.example/mod/ingest')
        self.assertAlmostEqual(int(headers[TIMESTAMP_HEADER]), time.time() + 600, delta=2)

    def test_stale_request_is_resigned_once_with_the_server_clock(self):
        transport = _support.FakeTransport()
        calls = []
        self.request(transport, calls)
        server_now = int(time.time()) + 3600
        transport.respond(STALE_REQUEST_STATUS, b'{"error":"stale_request"}', {SERVER_TIME_HEADER: str(server_now)})
        self.assertEqual(len(transport.requests), 2)
        self.assertEqual(calls, [])
        retried = transport.requests[1]['headers']
        self.assertAlmostEqual(int(retried[TIMESTAMP_HEADER]), server_now, delta=2)
        self.assertNotEqual(retried[NONCE_HEADER], transport.requests[0]['headers'][NONCE_HEADER])
        self.assertTrue(verify_request('s' * 40, 'POST', 'https://api.example/mod/ingest', retried, b'{}'))
        transport.respond(200, b'{}')
        self.assertEqual([call[0] for call in calls], [200])

    def test_a_second_stale_reply_reaches_the_caller(self):
        transport = _support.FakeTransport()
        calls = []
        self.request(transport, calls)
        transport.respond(STALE_REQUEST_STATUS, b'', {SERVER_TIME_HEADER: '1790000000'})
        transport.respond(STALE_REQUEST_STATUS, b'', {SERVER_TIME_HEADER: '1790000000'})
        self.assertEqual(len(transport.requests), 2)
        self.assertEqual([call[0] for call in calls], [STALE_REQUEST_STATUS])

    def test_sync_clock_handles_a_device_clock_that_runs_ahead(self):
        self.assertTrue(sync_clock({'X-Otmetki-Server-Time': '1790000000'}, now=1790000900.0))
        self.assertEqual(clock_offset(), -900.0)

    def test_sync_clock_keeps_the_offset_without_a_usable_header(self):
        signing._clock['offset'] = 42.0
        self.assertFalse(sync_clock({'Date': 'garbage'}, now=1790000000.0))
        self.assertEqual(clock_offset(), 42.0)

    def test_other_errors_are_not_retried_even_with_server_time(self):
        transport = _support.FakeTransport()
        calls = []
        self.request(transport, calls)
        transport.respond(401, b'{"error":"bad_signature"}', {SERVER_TIME_HEADER: '1790000000'})
        self.assertEqual(len(transport.requests), 1)
        self.assertEqual([call[0] for call in calls], [401])
        self.assertEqual(clock_offset(), 0.0)

    def test_stale_reply_without_server_time_is_not_retried(self):
        transport = _support.FakeTransport()
        calls = []
        self.request(transport, calls)
        transport.respond(STALE_REQUEST_STATUS)
        self.assertEqual(len(transport.requests), 1)
        self.assertEqual([call[0] for call in calls], [STALE_REQUEST_STATUS])


if __name__ == '__main__':
    unittest.main()
