from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.compat import to_text


class Labels(object):
    """Label lookup over the shared string catalog, most specific key first:
    component title `component_<id>`; field `<component>_<key>`, `setting_<key>`, then `<key>` (the
    companion labels its switches by key); hints the same with `_hint`; choices `<component>_<key>_<value>`
    then `choice_<value>`."""

    def __init__(self, catalog, language):
        self.catalog = catalog
        self.language = language

    def find(self, *keys):
        for key in keys:
            text = self.catalog.lookup(self.language, key)
            if text:
                return text
        return None

    def title(self, component_id, fallback=None):
        return self.find('component_%s' % component_id) or fallback or to_text(component_id)

    def component_hint(self, component_id):
        return self.find('component_%s_hint' % component_id)

    def field(self, component_id, key):
        return self.find('%s_%s' % (component_id, key), 'setting_%s' % key, key) or to_text(key)

    def field_hint(self, component_id, key):
        return self.find('%s_%s_hint' % (component_id, key), 'setting_%s_hint' % key)

    def choice(self, component_id, key, value):
        return self.find('%s_%s_%s' % (component_id, key, value), 'choice_%s' % value) or to_text(value)

    def text(self, key, **params):
        text = self.find(key) or to_text(key)
        return text.format(**params) if params else text
