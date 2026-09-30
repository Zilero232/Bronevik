from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.vendor import attr
from ..fields import SWITCH_KEY, TYPE_BOOL, describe_fields, field_type
from .constants import PANEL_POSITION_KEYS
from .placement import placement_of


@attr.s(eq=False)
class Component(object):

    id = attr.ib()
    group = attr.ib()
    source = attr.ib()
    keys = attr.ib(converter=tuple)
    switch = attr.ib(default=None)
    switch_source = attr.ib(default=None)
    panel = attr.ib(default=False)
    instance = attr.ib(default=None)
    fallback_title = attr.ib(default=None)

    def __attrs_post_init__(self):
        self.switch_source = self.switch_source or self.source

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

    def _describe_switch(self):
        switch_settings = self.switch_source.settings
        if self.switch is None or switch_settings is None:
            return None
        return {'key': self.switch, 'value': bool(switch_settings.get(self.switch))}

    def _describe_fields(self, labels):
        settings = self.source.settings
        if settings is None:
            return []
        return describe_fields(settings, self.field_keys(), self.id, labels)

    def describe(self, labels):
        section, context = placement_of(self.id, self.group, self.panel)
        described = {
            'id': self.id,
            'group': self.group,
            'section': section,
            'context': context,
            'title': labels.title(self.id, self.fallback_title),
            'hint': labels.component_hint(self.id),
            'switch': self._describe_switch(),
            'fields': self._describe_fields(labels),
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
