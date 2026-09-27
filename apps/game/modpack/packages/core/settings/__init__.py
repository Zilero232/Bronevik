"""Settings driven by a schema: defaults, typed merge, clamped numbers, enumerated strings.

A value of the wrong type, an unknown key or a value a normalizer rejects is ignored, so a hand-edited
config.json can never put the mod into a state its schema does not describe.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import is_int, is_number, string_types, to_text


class Schema(object):

    def __init__(self, defaults, choices=None, limits=None, normalizers=None):
        self.defaults = dict(defaults)
        self.choices = dict(choices or {})
        self.limits = dict(limits or {})
        self.normalizers = dict(normalizers or {})

    def coerce(self, key, value):
        """The stored form of `value` for `key`, or None when it is rejected."""
        default = self.defaults[key]
        if isinstance(default, bool):
            return value if isinstance(value, bool) else None
        if is_int(default):
            if not is_number(value):
                return None
            value = int(value)
            low, high = self.limits.get(key, (None, None))
            if low is not None:
                value = max(low, min(high, value))
            return value
        if isinstance(default, string_types):
            if not isinstance(value, string_types):
                return None
            value = to_text(value).strip()
            normalize = self.normalizers.get(key)
            if normalize is not None:
                value = normalize(value)
                if value is None:
                    return None
            if key in self.choices and value not in self.choices[key]:
                return None
            return value
        return None


class Settings(object):

    schema = None

    def __init__(self, values=None, schema=None):
        if schema is not None:
            self.schema = schema
        self.values = dict(self.schema.defaults)
        if values:
            self.update(values)

    def update(self, values):
        """Merge `values`; returns the sorted keys that changed."""
        changed = []
        if not isinstance(values, dict):
            return changed
        defaults = self.schema.defaults
        for key, value in values.items():
            if key not in defaults:
                continue
            coerced = self.schema.coerce(key, value)
            if coerced is None:
                continue
            if self.values.get(key) != coerced:
                self.values[key] = coerced
                changed.append(key)
        return sorted(changed)

    def get(self, key):
        return self.values.get(key, self.schema.defaults.get(key))

    def is_enabled(self, feature):
        return bool(self.values.get('enabled')) and bool(self.values.get(feature))

    def to_dict(self):
        return dict(self.values)
