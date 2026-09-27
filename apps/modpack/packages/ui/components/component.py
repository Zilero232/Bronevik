from __future__ import absolute_import, division, print_function, unicode_literals

from ..fields import SWITCH_KEY, TYPE_BOOL, describe_fields, field_type
from .constants import PANEL_POSITION_KEYS


class Component(object):
    """A card of the window: an optional switch (usually the companion's config.json switch of the
    feature), fields from one settings source (config.json keys or the feature's components.json
    section), and an optional feature instance that adds actions or a page (duck-typed `ui_actions()`,
    `ui_page()`, `ui_action(action, row, value)`)."""

    def __init__(self, component_id, group, source, keys, switch=None, switch_source=None, panel=False, instance=None, title=None):
        self.id = component_id
        self.group = group
        self.source = source
        self.keys = tuple(keys)
        self.switch = switch
        self.switch_source = switch_source or source
        self.panel = panel
        self.instance = instance
        self.fallback_title = title

    def field_keys(self):
        hidden = set([self.switch, SWITCH_KEY]) if self.switch is not None else set()
        keys = [key for key in self.keys if key not in hidden]
        if self.panel:
            keys = [key for key in keys if key not in PANEL_POSITION_KEYS]
        return keys

    def editable(self, key):
        return key == self.switch or key in self.field_keys()

    def source_of(self, key):
        return self.switch_source if key == self.switch else self.source

    def update(self, key, value):
        """(changed keys, source kind) of setting one value; nothing when the key is not on the card."""
        if not self.editable(key):
            return [], None
        source = self.source_of(key)
        return source.update({key: value}), source.kind

    def describe(self, labels):
        settings = self.source.settings
        switch_settings = self.switch_source.settings
        switch = None
        if self.switch is not None and switch_settings is not None:
            switch = {'key': self.switch, 'value': bool(switch_settings.get(self.switch))}
        described = {
            'id': self.id,
            'group': self.group,
            'title': labels.title(self.id, self.fallback_title),
            'hint': labels.component_hint(self.id),
            'switch': switch,
            'fields': describe_fields(settings, self.field_keys(), self.id, labels) if settings is not None else [],
            'panel': bool(self.panel),
            'actions': [],
            'page': None,
        }
        instance = self.instance
        if instance is not None and hasattr(instance, 'ui_actions'):
            described['actions'] = list(instance.ui_actions() or [])
        if instance is not None and hasattr(instance, 'ui_page'):
            described['page'] = instance.ui_page()
        return described


def switch_of(settings, keys, candidates):
    """The first bool key of `keys` that is a switch (a companion feature switch)."""
    for key in keys:
        if key in candidates and field_type(settings.schema, key) == TYPE_BOOL:
            return key
    return None


def section_switch(settings):
    if settings is not None and SWITCH_KEY in settings.schema.defaults:
        return SWITCH_KEY
    return None
