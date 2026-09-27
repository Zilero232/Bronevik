from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.compat import is_int, is_number, string_types, to_text
from .constants import APPLICABLE_GROUPS, RESOLUTION_FIELDS, RESOLUTION_RE, TEXT_MAX
from .fields import BY_PATH, BY_RAW, FIELDS, TEXT


def _clean(kind, value):
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
        if not isinstance(value, string_types) or not RESOLUTION_RE.match(value):
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
    result = {}
    if not isinstance(raw, dict):
        return result
    for key, value in raw.items():
        entry = BY_RAW.get(key)
        if entry is None:
            continue
        cleaned = _clean(entry[3], value)
        if cleaned is not None:
            result[key] = cleaned
    return result


def build_export(raw_settings):
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
    entry = BY_PATH.get((group, field))
    return entry[0] if entry is not None else None


def changes_to_values(changes):
    values = {}
    for group, field, _, new in changes:
        key = raw_key_of(group, field)
        if key is not None:
            values[key] = new
    return values
