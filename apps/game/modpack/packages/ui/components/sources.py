from __future__ import absolute_import, division, print_function, unicode_literals


class ConfigSource(object):

    kind = 'config'

    def __init__(self, config, save):
        self.settings = config
        self._save = save

    def update(self, values):
        changed = self.settings.update(values)
        if changed:
            self._save()
        return changed


class SectionSource(object):

    kind = 'section'

    def __init__(self, component_config, key, layer=None):
        self.component_config = component_config
        self.key = key
        self.layer = layer

    @property
    def settings(self):
        return self.component_config.get(self.key)

    def is_panel(self):
        return self.layer is not None and self.key in getattr(self.layer, 'panels', {})

    def update(self, values):
        if self.is_panel():
            return self.layer.update_settings(self.key, values)
        return self.component_config.update(self.key, values)
