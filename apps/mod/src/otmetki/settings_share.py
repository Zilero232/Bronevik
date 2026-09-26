# -*- coding: utf-8 -*-
"""Streamer settings: export own standard client settings and apply a creator's.

The client glue reads the game's settings core into a flat dict keyed by the raw
keys of FIELDS (e.g. 'fov', 'sniperSens'). Everything here is a whitelist:
anything not in FIELDS (login, account, hardware, mods, unknown keys) is dropped.
"""
import os
import re

from .compat import is_int, is_number, string_types, to_text
from .jsonutil import dumps_bytes
from .signing import signed_headers

SETTINGS_PATH = '/mod/settings'
POLL_PATH = '/mod/settings/apply/poll'
RESULT_PATH = '/mod/settings/apply/%s/result'

TARGETS = ('profile', 'private')
RESULT_STATUSES = ('applied', 'rejected')
APPLICABLE_GROUPS = ('display', 'camera', 'controls', 'zoom', 'sight', 'markers', 'minimap', 'sound', 'battleUi')
RESOLUTION_FIELDS = ('resolution', 'refreshRate', 'windowMode')

WINDOW_MODES = ('fullscreen', 'borderless', 'windowed')
CLIENTS = ('sd', 'hd')
PRESETS = ('minimum', 'low', 'medium', 'high', 'maximum', 'ultra', 'custom')
GRAPHICS_OPTIONS = ('effects', 'vegetation', 'shadows', 'terrain', 'water', 'lighting', 'textures', 'motionBlur',
                    'tessellation', 'antialiasing', 'decals', 'postProcessing')
ZOOM_STEPS = ('x2', 'x4', 'x8', 'x16', 'x25')
GUN_MARKERS = ('server', 'client')
MARKER_FIELDS = ('icon', 'tier', 'vehicleName', 'playerName', 'hpBar', 'hpValue', 'damage')
TEXT_MAX = 120

_RESOLUTION_RE = re.compile(r'^\d{3,5}x\d{3,5}$')
_UUID_RE = re.compile(r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')

BOOL = ('bool',)
TEXT = ('text',)


def _int(low, high):
    return ('int', low, high)


def _enum(choices):
    return ('enum', choices)


def _enum_list(choices):
    return ('enum_list', choices)


SENSITIVITY = ('num', 0.01, 3.0)
VOLUME = _int(0, 100)

# (raw key, group, dotted field inside the group, kind)
FIELDS = (
    ('resolution', 'display', 'resolution', ('resolution',)),
    ('refreshRate', 'display', 'refreshRate', _int(30, 540)),
    ('windowMode', 'display', 'windowMode', _enum(WINDOW_MODES)),
    ('graphicsClient', 'display', 'client', _enum(CLIENTS)),
    ('graphicsPreset', 'display', 'preset', _enum(PRESETS)),
    ('graphicsOverrides', 'display', 'overrides', ('text_map', GRAPHICS_OPTIONS)),
    ('fpsCap', 'display', 'fpsCap', _int(0, 1000)),
    ('vsync', 'display', 'vsync', BOOL),
    ('tripleBuffering', 'display', 'tripleBuffering', BOOL),
    ('fov', 'camera', 'fov', _int(70, 120)),
    ('dynamicFov', 'camera', 'dynamicFov', ('fov_range', 70, 120)),
    ('postMortem', 'camera', 'postMortem', BOOL),
    ('sniperDynamicCamera', 'camera', 'sniperDynamicCamera', BOOL),
    ('horizontalStabilisation', 'camera', 'horizontalStabilisation', BOOL),
    ('arcadeSens', 'controls', 'sensitivity.arcade', SENSITIVITY),
    ('sniperSens', 'controls', 'sensitivity.sniper', SENSITIVITY),
    ('artillerySens', 'controls', 'sensitivity.artillery', SENSITIVITY),
    ('invert', 'controls', 'invert', BOOL),
    ('zoomSteps', 'zoom', 'steps', _enum_list(ZOOM_STEPS)),
    ('arcadeReticle', 'sight', 'arcade.reticle', TEXT),
    ('arcadeGunMarker', 'sight', 'arcade.gunMarker', _enum(GUN_MARKERS)),
    ('arcadeSightColour', 'sight', 'arcade.colour', TEXT),
    ('sniperReticle', 'sight', 'sniper.reticle', TEXT),
    ('sniperGunMarker', 'sight', 'sniper.gunMarker', _enum(GUN_MARKERS)),
    ('sniperSightColour', 'sight', 'sniper.colour', TEXT),
    ('enemyMarkers', 'markers', 'enemy.base', _enum_list(MARKER_FIELDS)),
    ('enemyMarkersAlt', 'markers', 'enemy.alt', _enum_list(MARKER_FIELDS)),
    ('allyMarkers', 'markers', 'ally.base', _enum_list(MARKER_FIELDS)),
    ('allyMarkersAlt', 'markers', 'ally.alt', _enum_list(MARKER_FIELDS)),
    ('destroyedMarkers', 'markers', 'destroyed.base', _enum_list(MARKER_FIELDS)),
    ('destroyedMarkersAlt', 'markers', 'destroyed.alt', _enum_list(MARKER_FIELDS)),
    ('minimapSize', 'minimap', 'size', _int(0, 10)),
    ('minimapTransparency', 'minimap', 'transparency', VOLUME),
    ('minimapViewRange', 'minimap', 'viewRangeCircles', BOOL),
    ('minimapDrawRange', 'minimap', 'drawRangeCircle', BOOL),
    ('minimapSpgSector', 'minimap', 'spgFireSector', BOOL),
    ('volumeMaster', 'sound', 'master', VOLUME),
    ('volumeMusic', 'sound', 'music', VOLUME),
    ('volumeEffects', 'sound', 'effects', VOLUME),
    ('volumeVoice', 'sound', 'voice', VOLUME),
    ('sixthSenseSound', 'sound', 'sixthSenseSound', TEXT),
    ('voicePack', 'sound', 'voicePack', TEXT),
    ('damagePanel', 'battleUi', 'damagePanel', TEXT),
    ('damageLog', 'battleUi', 'damageLog', BOOL),
    ('efficiencyRibbons', 'battleUi', 'efficiencyRibbons', BOOL),
    ('sixthSenseIcon', 'battleUi', 'sixthSenseIcon', TEXT),
)

RAW_KEYS = tuple(entry[0] for entry in FIELDS)
_BY_RAW = dict((entry[0], entry) for entry in FIELDS)
_BY_PATH = dict(((entry[1], entry[2]), entry) for entry in FIELDS)


class SettingsShareError(Exception):

    def __init__(self, reason):
        Exception.__init__(self, reason)
        self.reason = reason


def _clean(kind, value):
    """Return the contract value, or None when the value is invalid or unknown."""
    tag = kind[0]
    if tag == 'bool':
        return value if isinstance(value, bool) else None
    if tag == 'int':
        if not is_number(value) or int(value) != value:
            return None
        value = int(value)
        return value if kind[1] <= value <= kind[2] else None
    if tag == 'num':
        if not is_number(value):
            return None
        value = round(float(value), 4)
        return value if kind[1] <= value <= kind[2] else None
    if tag == 'text':
        if not isinstance(value, string_types):
            return None
        value = to_text(value).strip()
        return value if 0 < len(value) <= TEXT_MAX else None
    if tag == 'enum':
        return value if isinstance(value, string_types) and value in kind[1] else None
    if tag == 'enum_list':
        if not isinstance(value, (list, tuple)):
            return None
        items = []
        for item in value:
            if not isinstance(item, string_types) or item not in kind[1]:
                return None
            if item not in items:
                items.append(to_text(item))
        return items
    if tag == 'resolution':
        if not isinstance(value, string_types) or not _RESOLUTION_RE.match(value):
            return None
        return to_text(value)
    if tag == 'fov_range':
        if not isinstance(value, (list, tuple)) or len(value) != 2 or not all(is_int(v) for v in value):
            return None
        low, high = int(value[0]), int(value[1])
        return [low, high] if kind[1] <= low <= high <= kind[2] else None
    if tag == 'text_map':
        if not isinstance(value, dict):
            return None
        result = {}
        for key, item in value.items():
            text = _clean(TEXT, item)
            if key in kind[1] and text is not None:
                result[to_text(key)] = text
        return result or None
    return None


def clean_values(raw):
    """Whitelist a flat dict of raw keys; unknown or invalid values are dropped."""
    result = {}
    if not isinstance(raw, dict):
        return result
    for key, value in raw.items():
        entry = _BY_RAW.get(key)
        if entry is None:
            continue
        cleaned = _clean(entry[3], value)
        if cleaned is not None:
            result[key] = cleaned
    return result


def build_export(raw_settings):
    """Flat raw values -> contract `settings` object (groups display..battleUi only)."""
    settings = {}
    values = clean_values(raw_settings)
    for raw_key, group, field, _ in FIELDS:
        if raw_key not in values:
            continue
        node = settings.setdefault(group, {})
        parts = field.split('.')
        for part in parts[:-1]:
            node = node.setdefault(part, {})
        node[parts[-1]] = values[raw_key]
    return settings


def flatten_settings(settings):
    """Contract `settings` object -> whitelisted flat raw values (inverse of build_export)."""
    raw = {}
    if not isinstance(settings, dict):
        return raw
    for raw_key, group, field, _ in FIELDS:
        node = settings.get(group)
        for part in field.split('.'):
            node = node.get(part) if isinstance(node, dict) else None
        if node is not None:
            raw[raw_key] = node
    return clean_values(raw)


def is_hardware_specific(group, field):
    return (group == 'display' and field in RESOLUTION_FIELDS) or (group == 'controls' and field.startswith('sensitivity.'))


def plan_apply(current, request, include_resolution=False, include_sensitivity=False):
    """List of (group, field, old, new) for the requested groups that differ from `current`.

    Resolution/refresh rate/window mode and sensitivity are left out unless opted in.
    """
    groups = [g for g in (request or {}).get('groups') or () if g in APPLICABLE_GROUPS]
    target = flatten_settings((request or {}).get('settings'))
    mine = clean_values(current)
    changes = []
    for raw_key, group, field, _ in FIELDS:
        if group not in groups or raw_key not in target:
            continue
        if is_hardware_specific(group, field) and not (include_sensitivity if group == 'controls' else include_resolution):
            continue
        old = mine.get(raw_key)
        new = target[raw_key]
        if old != new:
            changes.append((group, field, old, new))
    return changes


def raw_key_of(group, field):
    entry = _BY_PATH.get((group, field))
    return entry[0] if entry is not None else None


def changes_to_values(changes):
    """Flat raw values to write for a plan."""
    values = {}
    for group, field, _, new in changes:
        key = raw_key_of(group, field)
        if key is not None:
            values[key] = new
    return values


def backup_path(config_dir, account_id):
    return os.path.join(config_dir, 'settings_backup_%d.json' % int(account_id))


class SettingsBackup(object):
    """The player's own values of every key an apply touched ("Вернуть мои").

    A second apply keeps the values saved by the first one, so restore always
    returns to the settings the player had before the first apply.
    """

    def __init__(self, storage):
        self.storage = storage

    def _read(self):
        data = self.storage.read(None)
        if not isinstance(data, dict) or not isinstance(data.get('values'), dict):
            return None
        return data

    def has(self):
        return bool(self.values())

    def save(self, current, changes, request_id, now):
        data = self._read() or {'values': {}}
        mine = clean_values(current)
        values = data['values']
        for group, field, _, _ in changes:
            key = raw_key_of(group, field)
            if key is not None and key in mine and key not in values:
                values[key] = mine[key]
        data['request_id'] = request_id
        data['saved_at'] = int(now)
        self.storage.write(data)
        return dict(values)

    def values(self):
        data = self._read()
        return clean_values(data['values']) if data is not None else {}

    def clear(self):
        self.storage.delete()


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
    if not isinstance(request_id, string_types) or not _UUID_RE.match(request_id):
        raise SettingsShareError('bad_id')
    return RESULT_PATH % request_id


def parse_poll_response(data):
    """Validated apply requests from a poll response; malformed items are dropped."""
    items = data.get('requests') if isinstance(data, dict) else None
    requests = []
    for item in items if isinstance(items, list) else ():
        if not isinstance(item, dict):
            continue
        request_id = item.get('id')
        if not isinstance(request_id, string_types) or not _UUID_RE.match(request_id):
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
    """POST `payload` signed exactly like /mod/ingest."""
    body = dumps_bytes(payload)
    headers = signed_headers(credentials.device_id, credentials.secret, body, user_agent)
    transport.request('POST', url, headers, body, callback)
