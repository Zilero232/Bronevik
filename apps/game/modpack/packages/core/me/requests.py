from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import is_int, is_number
from ..errors import ReasonError
from .constants import (
    AUTH_STATUSES,
    MAX_RETRY_S,
    MAX_TANKS,
    RATE_LIMITED_STATUS,
    RETRY_AFTER_ERROR_S,
    RETRY_AFTER_LIMIT_S,
)


def device_body(credentials):
    """{device_id, account_id} of the bound device, the body every /mod/me read starts from."""
    if credentials is None or not credentials.is_valid():
        raise ReasonError('not_bound')
    return {'device_id': credentials.device_id, 'account_id': credentials.account_id}


def tank_ids(values, limit=MAX_TANKS):
    """Valid unique tank ids in order, at most `limit`."""
    ids = []
    for tank_id in values:
        if is_int(tank_id) and tank_id > 0 and tank_id not in ids:
            ids.append(int(tank_id))
    return ids[:limit]


def tanks_request(credentials, values):
    ids = tank_ids(values)
    if not ids:
        raise ReasonError('no_tanks')
    body = device_body(credentials)
    body['tank_ids'] = ids
    return body


def is_auth_failure(status):
    return status in AUTH_STATUSES


def retry_delay(status, retry_after=None):
    """How long a failed read waits: the 429's Retry-After (capped), else a fixed delay."""
    if status == RATE_LIMITED_STATUS and is_number(retry_after) and retry_after > 0:
        return min(float(retry_after), MAX_RETRY_S)
    if status == RATE_LIMITED_STATUS:
        return RETRY_AFTER_LIMIT_S
    return RETRY_AFTER_ERROR_S
