import re
import time

from ..core.compat import is_int, string_types, to_text

CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
CODE_LENGTH = 10
BIND_PATH = '/mod/bind'

_CODE_RE = re.compile('^[' + CODE_ALPHABET + ']{' + str(CODE_LENGTH) + '}$')
_STRIP_RE = re.compile(r'[\s\-_]+')


class BindError(Exception):

    def __init__(self, reason):
        Exception.__init__(self, reason)
        self.reason = reason


def normalize_code(raw):
    if not isinstance(raw, string_types):
        return None
    code = _STRIP_RE.sub('', to_text(raw)).upper()
    if _CODE_RE.match(code):
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


class Credentials(object):

    def __init__(self, device_id, secret, account_id, bound_at=None):
        self.device_id = device_id
        self.secret = secret
        self.account_id = account_id
        self.bound_at = bound_at

    def is_valid(self):
        return (
            isinstance(self.device_id, string_types) and len(self.device_id) > 0
            and isinstance(self.secret, string_types) and len(self.secret) >= 32
            and is_int(self.account_id) and self.account_id > 0
        )

    def to_dict(self):
        return {
            'device_id': self.device_id,
            'secret': self.secret,
            'account_id': self.account_id,
            'bound_at': self.bound_at,
        }

    @classmethod
    def from_dict(cls, data):
        if not isinstance(data, dict):
            return None
        creds = cls(data.get('device_id'), data.get('secret'), data.get('account_id'), data.get('bound_at'))
        return creds if creds.is_valid() else None


def parse_bind_response(data, expected_account_id, now=None):
    if not isinstance(data, dict):
        raise BindError('bad_response')
    if data.get('error'):
        raise BindError(to_text(data.get('error')))
    account_id = data.get('account_id')
    if account_id != expected_account_id:
        raise BindError('account_mismatch')
    creds = Credentials(data.get('device_id'), data.get('secret'), account_id, int(now if now is not None else time.time()))
    if not creds.is_valid():
        raise BindError('bad_response')
    return creds


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

    def save(self, creds):
        data = self._read()
        data['accounts'][str(creds.account_id)] = creds.to_dict()
        self.storage.write(data)

    def remove(self, account_id):
        data = self._read()
        if data['accounts'].pop(str(account_id), None) is not None:
            self.storage.write(data)
            return True
        return False
