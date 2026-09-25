import unittest

import _support  # noqa: F401
from bronevik.signing import DEVICE_HEADER, SIGNATURE_HEADER, sign, signed_headers, verify


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
        headers = signed_headers('dev-1', 's' * 40, b'{}', 'bronevik.companion/0.1.0')
        self.assertEqual(headers[DEVICE_HEADER], 'dev-1')
        self.assertEqual(headers[SIGNATURE_HEADER], sign('s' * 40, b'{}'))
        self.assertEqual(headers['Content-Type'], 'application/json')


if __name__ == '__main__':
    unittest.main()
