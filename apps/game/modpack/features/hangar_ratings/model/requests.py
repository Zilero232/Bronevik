from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, is_number, to_text
from ....core.errors import ReasonError
from .constants import (AUTH_STATUSES, MAX_MARKS, MAX_MASTERY, MAX_RETRY_S, MAX_TANKS, RATE_LIMITED_STATUS, RATING_METRICS, RATING_TIERS,
                        RETRY_AFTER_ERROR_S, RETRY_AFTER_LIMIT_S, SESSION_RATINGS, TANK_RATINGS)


def device_body(credentials):
    if credentials is None or not credentials.is_valid():
        raise ReasonError('not_bound')
    return {'device_id': credentials.device_id, 'account_id': credentials.account_id}


def overview_request(credentials):
    return device_body(credentials)


def tanks_request(credentials, tank_ids):
    ids = []
    for tank_id in tank_ids:
        if is_int(tank_id) and tank_id > 0 and tank_id not in ids:
            ids.append(int(tank_id))
    if not ids:
        raise ReasonError('no_tanks')
    body = device_body(credentials)
    body['tank_ids'] = ids[:MAX_TANKS]
    return body


def _number(value, low=None, high=None):
    if not is_number(value):
        return None
    if low is not None and value < low:
        return None
    if high is not None and value > high:
        return None
    return float(value)


def _count(value, high=None):
    if not is_int(value) or value < 0 or (high is not None and value > high):
        return None
    return int(value)


def _rating(value):
    if not isinstance(value, dict):
        return {'value': None, 'tier': None}
    tier = value.get('tier')
    return {'value': _number(value.get('value')), 'tier': tier if tier in RATING_TIERS else None}


def _stats(data, ratings):
    stats = {
        'battles': _count(data.get('battles')) or 0,
        'win_rate': _number(data.get('win_rate'), 0, 100),
        'avg_damage': _number(data.get('avg_damage'), 0),
    }
    for key in ratings:
        stats[key] = _rating(data.get(key))
    return stats


# Fair play: an answer about any account other than the bound one is dropped, even if the server sent it.
def _owned(data, account_id):
    return isinstance(data, dict) and account_id is not None and data.get('account_id') == account_id


def parse_overview(data, account_id):
    if not _owned(data, account_id):
        return None
    overall = data.get('overall')
    session = data.get('session')
    nickname = data.get('nickname')
    parsed = {
        'account_id': account_id,
        'nickname': to_text(nickname) if nickname else None,
        'overall': _stats(overall, RATING_METRICS) if isinstance(overall, dict) else None,
        'session': None,
    }
    if isinstance(session, dict):
        parsed['session'] = _stats(session, SESSION_RATINGS)
        parsed['session']['is_live'] = session.get('is_live') is True
    return parsed


def parse_tanks(data, account_id):
    if not _owned(data, account_id) or not isinstance(data.get('tanks'), list):
        return {}
    rows = {}
    for item in data['tanks']:
        tank_id = item.get('tank_id') if isinstance(item, dict) else None
        if not is_int(tank_id) or tank_id <= 0:
            continue
        row = _stats(item, TANK_RATINGS)
        row.update({
            'tank_id': int(tank_id),
            'moe_percent': _number(item.get('moe_percent'), 0, 100),
            'marks_on_gun': _count(item.get('marks_on_gun'), MAX_MARKS),
            'mastery': _count(item.get('mastery'), MAX_MASTERY) or 0,
        })
        rows[int(tank_id)] = row
    return rows


def is_auth_failure(status):
    return status in AUTH_STATUSES


def retry_delay(status, retry_after=None):
    if status == RATE_LIMITED_STATUS and is_number(retry_after) and retry_after > 0:
        return min(float(retry_after), MAX_RETRY_S)
    if status == RATE_LIMITED_STATUS:
        return RETRY_AFTER_LIMIT_S
    return RETRY_AFTER_ERROR_S
