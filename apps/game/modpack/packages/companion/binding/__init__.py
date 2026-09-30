from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ...core.compat import is_int, string_types, to_text
from ...core.errors import ReasonError
from ...core.vendor import attr
from .constants import BIND_PATH, CODE_PATTERN, CODE_SEPARATORS, MIN_SECRET_LENGTH  # noqa: F401


class BindError(ReasonError):
    pass


def normalize_code(raw):
    if not isinstance(raw, string_types):
        return None
    code = CODE_SEPARATORS.sub('', to_text(raw)).upper()
    if CODE_PATTERN.match(code):
        return str(code)
    return None


def build_bind_request(code, account_id, mod_version, client_version, realm):
    normalized = normalize_code(code)
    if normalized is None:
        raise BindError('invalid_code')
    if not is_int(account_id) or account_id <= 0:
        raise BindError('no_account')
    return {
        'code': normalized,
        'account_id': account_id,
        'mod_version': mod_version,
        'client_version': client_version or '',
        'realm': realm,
    }


@attr.s
class Credentials(object):

    device_id = attr.ib()
    secret = attr.ib()
    account_id = attr.ib()
    bound_at = attr.ib(default=None)

    def is_valid(self):
        has_device = isinstance(self.device_id, string_types) and len(self.device_id) > 0
        has_secret = isinstance(self.secret, string_types) and len(self.secret) >= MIN_SECRET_LENGTH
        has_account = is_int(self.account_id) and self.account_id > 0
        return has_device and has_secret and has_account

    def to_dict(self):
        return attr.asdict(self)

    @classmethod
    def from_dict(cls, data):
        if not isinstance(data, dict):
            return None
        credentials = cls(data.get('device_id'), data.get('secret'), data.get('account_id'), data.get('bound_at'))
        return credentials if credentials.is_valid() else None


def parse_bind_response(data, expected_account_id, now=None):
    if not isinstance(data, dict):
        raise BindError('bad_response')
    if data.get('error'):
        raise BindError(to_text(data.get('error')))
    account_id = data.get('account_id')
    if account_id != expected_account_id:
        raise BindError('account_mismatch')
    bound_at = int(now if now is not None else time.time())
    credentials = Credentials(data.get('device_id'), data.get('secret'), account_id, bound_at)
    if not credentials.is_valid():
        raise BindError('bad_response')
    return credentials


class CredentialStore(object):

    def __init__(self, storage):
        self.storage = storage

    def _read(self):
        data = self.storage.read({})
        if not isinstance(data, dict) or not isinstance(data.get('accounts'), dict):
            return {'accounts': {}}
        return data

    def get(self, account_id):
        if not is_int(account_id):
            return None
        return Credentials.from_dict(self._read()['accounts'].get(str(account_id)))

    def save(self, credentials):
        data = self._read()
        data['accounts'][str(credentials.account_id)] = credentials.to_dict()
        self.storage.write(data)

    def remove(self, account_id):
        data = self._read()
        if data['accounts'].pop(str(account_id), None) is not None:
            self.storage.write(data)
            return True
        return False
