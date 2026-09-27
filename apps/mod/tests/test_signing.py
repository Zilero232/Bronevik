import unittest

import _support  # noqa: F401
from otmetki.signing import (DEVICE_HEADER, NONCE_HEADER, SIGNATURE_HEADER, TIMESTAMP_HEADER, request_path, sign, signed_headers,
                             signed_message, verify, verify_request)


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
        self.assertEqual(signed_message('post', '/p', 5, 'n', b'x'), b'v2\nPOST\n/p\n5\nn\nx')


if __name__ == '__main__':
    unittest.main()
