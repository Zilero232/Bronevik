from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.compat import is_int, string_types
from .constants import TEXT_MAX_LENGTH, TYPE_BOOL, TYPE_CHOICE, TYPE_INT, TYPE_TEXT


def field_type(schema, key):
    default = schema.defaults[key]
    if isinstance(default, bool):
        return TYPE_BOOL
    if is_int(default):
        return TYPE_INT
    if isinstance(default, string_types):
        return TYPE_CHOICE if key in schema.choices else TYPE_TEXT
    return None


def describe_field(settings, key, component_id, labels):
    """One editable value of a `Settings` object, described from its schema (type, limits, choices)."""
    schema = settings.schema
    kind = field_type(schema, key)
    if kind is None:
        return None
    field = {
        'key': key,
        'type': kind,
        'label': labels.field(component_id, key),
        'hint': labels.field_hint(component_id, key),
        'value': settings.get(key),
        'default': schema.defaults[key],
    }
    if kind == TYPE_INT:
        low, high = schema.limits.get(key, (None, None))
        field['min'] = low
        field['max'] = high
    elif kind == TYPE_CHOICE:
        field['choices'] = [{'value': value, 'label': labels.choice(component_id, key, value)} for value in schema.choices[key]]
    elif kind == TYPE_TEXT:
        field['max_length'] = TEXT_MAX_LENGTH
    return field


def describe_fields(settings, keys, component_id, labels):
    fields = []
    for key in keys:
        if key in settings.schema.defaults:
            field = describe_field(settings, key, component_id, labels)
            if field is not None:
                fields.append(field)
    return fields
