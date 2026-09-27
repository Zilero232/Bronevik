# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.codec import encode_json
from ...core.compat import string_types, to_text
from ...core.net.signing import signed_request
from .backup import SettingsBackup, backup_path  # noqa: F401
from .constants import (APPLICABLE_GROUPS, POLL_PATH, RESULT_PATH, RESULT_STATUSES, SETTINGS_PATH, TARGETS,  # noqa: F401
                        UUID_RE)
from .errors import SettingsShareError  # noqa: F401
from .fields import FIELDS, RAW_KEYS  # noqa: F401
from .values import build_export, changes_to_values, clean_values, flatten_settings, is_hardware_specific, plan_apply, raw_key_of  # noqa: F401


def _device_fields(credentials):
    if credentials is None or not credentials.is_valid():
        raise SettingsShareError('not_bound')
    return {'device_id': credentials.device_id, 'account_id': credentials.account_id}


def build_export_request(credentials, mod_version, target, anonymous_stats, raw_settings):
    if target not in TARGETS:
        raise SettingsShareError('bad_target')
    settings = build_export(raw_settings)
    if not settings:
        raise SettingsShareError('empty')
    payload = _device_fields(credentials)
    payload.update({
        'mod_version': to_text(mod_version)[:32],
        'target': target,
        'anonymous_stats': bool(anonymous_stats),
        'settings': settings,
    })
    return payload


def build_poll_request(credentials):
    return _device_fields(credentials)


def build_result_request(credentials, status):
    if status not in RESULT_STATUSES:
        raise SettingsShareError('bad_status')
    payload = _device_fields(credentials)
    payload['status'] = status
    return payload


def result_path(request_id):
    if not isinstance(request_id, string_types) or not UUID_RE.match(request_id):
        raise SettingsShareError('bad_id')
    return RESULT_PATH % request_id


def parse_poll_response(data):
    items = data.get('requests') if isinstance(data, dict) else None
    requests = []
    for item in items if isinstance(items, list) else ():
        if not isinstance(item, dict):
            continue
        request_id = item.get('id')
        if not isinstance(request_id, string_types) or not UUID_RE.match(request_id):
            continue
        groups = [g for g in item.get('groups') or () if g in APPLICABLE_GROUPS]
        if not groups:
            continue
        slug = item.get('profile_slug')
        requests.append({
            'id': to_text(request_id),
            'profile_slug': to_text(slug) if isinstance(slug, string_types) else u'',
            'groups': groups,
            'settings': build_export(flatten_settings(item.get('settings'))),
        })
    return requests


def signed_post(transport, url, credentials, payload, user_agent, callback):
    signed_request(transport, 'POST', url, credentials.device_id, credentials.secret, encode_json(payload), user_agent, callback)
