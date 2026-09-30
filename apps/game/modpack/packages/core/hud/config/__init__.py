"""components.json: one section per component id, each merged through its own `Schema`.

A hand-edited value outside the schema is ignored, and the sections of components that are not
installed are kept untouched (the guarantee config.json gives its switches).
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...settings import Settings


class ComponentConfig(object):

    def __init__(self, store):
        self.store = store
        data = store.read({})
        self.data = data if isinstance(data, dict) else {}
        self.sections = {}

    def section(self, key, schema):
        """The settings of component `key`, created on first call (later calls return the same object).
        The merged defaults are written back so the player finds every key in the file."""
        if key in self.sections:
            return self.sections[key]
        raw = self.data.get(key)
        settings = Settings(raw if isinstance(raw, dict) else None, schema)
        self.sections[key] = settings
        if raw != settings.to_dict():
            self.data[key] = settings.to_dict()
            self.save()
        return settings

    def get(self, key):
        return self.sections.get(key)

    def update(self, key, values):
        """Merge `values` into a registered section; returns the changed keys (saved when any)."""
        settings = self.sections.get(key)
        if settings is None:
            return []
        changed = settings.update(values)
        if changed:
            self.data[key] = settings.to_dict()
            self.save()
        return changed

    def raw(self, key):
        """A section kept as plain data (no schema), or None."""
        return self.data.get(key)

    def set_raw(self, key, value):
        """Replace a plain-data section and save the file."""
        self.data[key] = value
        return self.save()

    def save(self):
        try:
            self.store.write(self.data)
        except (IOError, OSError):
            return False
        return True
