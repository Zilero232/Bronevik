import unittest

import _support
from otmetki.binding import BindError, Credentials, CredentialStore, build_bind_request, normalize_code, parse_bind_response
from otmetki.storage import MemoryFile

SECRET = 'q' * 43


class BindingTest(unittest.TestCase):

    def test_normalize(self):
        self.assertEqual(normalize_code(' ab3k7-zq4m9 '), 'AB3K7ZQ4M9')
        self.assertEqual(normalize_code(u'xyz 234 abcd'), 'XYZ234ABCD')
        self.assertIsNone(normalize_code('ABCDEFGH2'))
        self.assertIsNone(normalize_code('ABCDEFGH20'))
        self.assertIsNone(normalize_code('ABCDEFGH2I'))
        self.assertIsNone(normalize_code('ABCDEFGH234'))
        self.assertIsNone(normalize_code(None))

    def test_request(self):
        request = build_bind_request('ab3k7zq4m9', 12345678, '0.1.0', '1.45.0', 'RU')
        self.assertEqual(request, {'code': 'AB3K7ZQ4M9', 'account_id': 12345678, 'mod_version': '0.1.0', 'client_version': '1.45.0', 'realm': 'RU'})
        validator = _support.schema_validator('bind.schema.json', 'request')
        if validator is not None:
            self.assertEqual(list(validator.iter_errors(request)), [])

    def test_request_errors(self):
        with self.assertRaises(BindError) as ctx:
            build_bind_request('bad', 1, '0.1.0', '', 'RU')
        self.assertEqual(ctx.exception.reason, 'invalid_code')
        with self.assertRaises(BindError) as ctx:
            build_bind_request('AB3K7ZQ4M9', None, '0.1.0', '', 'RU')
        self.assertEqual(ctx.exception.reason, 'no_account')

    def test_response(self):
        creds = parse_bind_response({'device_id': 'dev_1', 'secret': SECRET, 'account_id': 7}, 7, now=100)
        self.assertEqual(creds.to_dict(), {'device_id': 'dev_1', 'secret': SECRET, 'account_id': 7, 'bound_at': 100})

    def test_response_errors(self):
        cases = [
            ({'device_id': 'dev', 'secret': SECRET, 'account_id': 8}, 'account_mismatch'),
            ({'device_id': 'dev', 'secret': 'short', 'account_id': 7}, 'bad_response'),
            ({'error': 'code_expired'}, 'code_expired'),
            ('nope', 'bad_response'),
        ]
        for data, reason in cases:
            with self.assertRaises(BindError) as ctx:
                parse_bind_response(data, 7)
            self.assertEqual(ctx.exception.reason, reason)

    def test_store_per_account(self):
        storage = MemoryFile()
        store = CredentialStore(storage)
        self.assertIsNone(store.get(7))
        store.save(Credentials('dev_a', SECRET, 7, 1))
        store.save(Credentials('dev_b', SECRET, 8, 2))
        self.assertEqual(CredentialStore(storage).get(7).device_id, 'dev_a')
        self.assertEqual(CredentialStore(storage).get(8).device_id, 'dev_b')
        self.assertTrue(store.remove(7))
        self.assertIsNone(store.get(7))
        self.assertFalse(store.remove(7))
        self.assertIsNone(CredentialStore(MemoryFile({'accounts': {'9': {'secret': 'x'}}})).get(9))


if __name__ == '__main__':
    unittest.main()
