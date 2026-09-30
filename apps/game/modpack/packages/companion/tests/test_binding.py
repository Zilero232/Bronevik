from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support
from otmetki.companion.binding import (
    BindError,
    Credentials,
    CredentialStore,
    build_bind_request,
    normalize_code,
    parse_bind_response,
)
from otmetki.core.storage import MemoryFile

SECRET = 'q' * 43
MALFORMED_CODES = ('ABCDEFGH2', 'ABCDEFGH20', 'ABCDEFGH2I', 'ABCDEFGH234', None)
BAD_RESPONSES = (
    ({'device_id': 'dev', 'secret': SECRET, 'account_id': 8}, 'account_mismatch'),
    ({'device_id': 'dev', 'secret': 'short', 'account_id': 7}, 'bad_response'),
    ({'error': 'code_expired'}, 'code_expired'),
    ('nope', 'bad_response'),
)


def bind_error_reason(call, *args):
    try:
        call(*args)
    except BindError as error:
        return error.reason
    return None


def store_with_two_accounts(storage):
    store = CredentialStore(storage)
    store.save(Credentials('dev_a', SECRET, 7, 1))
    store.save(Credentials('dev_b', SECRET, 8, 2))
    return store


class NormalizeCodeTest(unittest.TestCase):

    def test_strips_separators_and_upper_cases(self):
        self.assertEqual(normalize_code(' ab3k7-zq4m9 '), 'AB3K7ZQ4M9')

    def test_accepts_unicode_with_spaces(self):
        self.assertEqual(normalize_code(u'xyz 234 abcd'), 'XYZ234ABCD')

    def test_rejects_wrong_length_ambiguous_letters_and_none(self):
        normalized = [normalize_code(code) for code in MALFORMED_CODES]

        self.assertEqual(normalized, [None] * len(MALFORMED_CODES))


class BindRequestTest(unittest.TestCase):

    def test_request(self):
        request = build_bind_request('ab3k7zq4m9', 12345678, '0.1.0', '1.45.0', 'RU')

        self.assertEqual(request, {
            'code': 'AB3K7ZQ4M9',
            'account_id': 12345678,
            'mod_version': '0.1.0',
            'client_version': '1.45.0',
            'realm': 'RU',
        })

    def test_request_matches_contract(self):
        validator = _support.schema_validator('bind.schema.json', 'request')
        if validator is None:
            self.skipTest('jsonschema is not installed')

        request = build_bind_request('ab3k7zq4m9', 12345678, '0.1.0', '1.45.0', 'RU')

        self.assertEqual(list(validator.iter_errors(request)), [])

    def test_rejects_an_invalid_code(self):
        reason = bind_error_reason(build_bind_request, 'bad', 1, '0.1.0', '', 'RU')

        self.assertEqual(reason, 'invalid_code')

    def test_rejects_a_missing_account(self):
        reason = bind_error_reason(build_bind_request, 'AB3K7ZQ4M9', None, '0.1.0', '', 'RU')

        self.assertEqual(reason, 'no_account')


class BindResponseTest(unittest.TestCase):

    def test_response_becomes_credentials_stamped_with_the_bind_time(self):
        credentials = parse_bind_response({'device_id': 'dev_1', 'secret': SECRET, 'account_id': 7}, 7, now=100)

        self.assertEqual(credentials.to_dict(), {
            'device_id': 'dev_1',
            'secret': SECRET,
            'account_id': 7,
            'bound_at': 100,
        })

    def test_response_errors(self):
        reasons = [(data, bind_error_reason(parse_bind_response, data, 7)) for data, _ in BAD_RESPONSES]

        self.assertEqual(reasons, list(BAD_RESPONSES))


class CredentialStoreTest(unittest.TestCase):

    def test_empty_store_has_no_credentials(self):
        self.assertIsNone(CredentialStore(MemoryFile()).get(7))

    def test_keeps_credentials_per_account(self):
        storage = MemoryFile()
        store_with_two_accounts(storage)

        reloaded = CredentialStore(storage)

        self.assertEqual(reloaded.get(7).device_id, 'dev_a')
        self.assertEqual(reloaded.get(8).device_id, 'dev_b')

    def test_remove_forgets_the_account(self):
        store = store_with_two_accounts(MemoryFile())

        removed = store.remove(7)

        self.assertTrue(removed)
        self.assertIsNone(store.get(7))

    def test_remove_of_an_unknown_account_reports_nothing_removed(self):
        store = CredentialStore(MemoryFile())

        self.assertFalse(store.remove(7))

    def test_invalid_stored_credentials_are_ignored(self):
        store = CredentialStore(MemoryFile({'accounts': {'9': {'secret': 'x'}}}))

        self.assertIsNone(store.get(9))


if __name__ == '__main__':
    unittest.main()
