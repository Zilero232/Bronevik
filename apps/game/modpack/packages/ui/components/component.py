from __future__ import absolute_import, division, print_function, unicode_literals

from ..fields import SWITCH_KEY, TYPE_BOOL, describe_fields, field_type
from .constants import PANEL_POSITION_KEYS
from .placement import placement_of


class Component(object):

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
        section, context = placement_of(self.id, self.group, self.panel)
        described = {
            'id': self.id,
            'group': self.group,
            'section': section,
            'context': context,
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
    for key in keys:
        if key in candidates and field_type(settings.schema, key) == TYPE_BOOL:
            return key
    return None


def section_switch(settings):
    if settings is not None and SWITCH_KEY in settings.schema.defaults:
        return SWITCH_KEY
    return None
