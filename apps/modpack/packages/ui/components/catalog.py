from __future__ import absolute_import, division, print_function, unicode_literals

from .component import Component, section_switch, switch_of
from .constants import COMPANION_ID, COMPANION_KEYS, COMPANION_SWITCH, GROUP_BATTLE, GROUP_DATA, GROUP_HANGAR, HIDDEN_CONFIG_KEYS, KNOWN_GROUPS
from .sources import ConfigSource, SectionSource


class FeatureInfo(object):
    """What the catalog needs of an attached feature: its id, its settings module (`SETTINGS`: companion
    keys it reads; `SCHEMA`: its components.json section; optional `GROUP`) and its instance."""

    def __init__(self, feature_id, settings_module=None, instance=None, title=None):
        self.id = feature_id
        self.settings_module = settings_module
        self.instance = instance
        self.title = title

    def config_keys(self):
        return tuple(getattr(self.settings_module, 'SETTINGS', ()) or ())

    def group(self, panel):
        declared = getattr(self.settings_module, 'GROUP', None)
        if declared:
            return declared
        return KNOWN_GROUPS.get(self.id, GROUP_BATTLE if panel else GROUP_HANGAR)


def _panels(layer):
    return getattr(layer, 'panels', {}) if layer is not None else {}


def companion_component(config, save, claimed, instance=None):
    keys = [COMPANION_SWITCH] + [key for key in COMPANION_KEYS if key in config.schema.defaults and key not in claimed]
    return Component(COMPANION_ID, GROUP_DATA, ConfigSource(config, save), keys, switch=COMPANION_SWITCH, instance=instance)


def _feature_component(feature, config, save_config, component_config, layer, switch_keys):
    panel = feature.id in _panels(layer)
    config_source = ConfigSource(config, save_config)
    keys = [key for key in feature.config_keys() if key not in HIDDEN_CONFIG_KEYS and key in config.schema.defaults]
    config_switch = switch_of(config, keys, switch_keys)
    section = component_config.get(feature.id) if component_config is not None else None
    if section is not None:
        switch = config_switch or section_switch(section)
        return Component(feature.id, feature.group(panel), SectionSource(component_config, feature.id, layer), sorted(section.schema.defaults),
                         switch=switch, switch_source=config_source if config_switch else None, panel=panel, instance=feature.instance,
                         title=feature.title)
    if not keys and feature.instance is None:
        return None
    return Component(feature.id, feature.group(panel), config_source, keys, switch=config_switch, panel=panel, instance=feature.instance,
                     title=feature.title)


def build_catalog(config, save_config, features, component_config=None, layer=None, companion_instance=None, switch_keys=()):
    """Cards in window order: the companion, every attached feature, then HUD panels no feature claims.
    `switch_keys` are the companion's feature switches (config.FEATURES)."""
    claimed = set()
    for feature in features:
        claimed.update(feature.config_keys())
    components = [companion_component(config, save_config, claimed, companion_instance)]
    seen = set([COMPANION_ID])
    for feature in features:
        component = _feature_component(feature, config, save_config, component_config, layer, switch_keys)
        if component is not None:
            components.append(component)
            seen.add(feature.id)
    for panel_id in sorted(_panels(layer)):
        section = component_config.get(panel_id) if component_config is not None else None
        if panel_id in seen or section is None:
            continue
        components.append(Component(panel_id, GROUP_BATTLE, SectionSource(component_config, panel_id, layer), sorted(section.schema.defaults),
                                    switch=section_switch(section), panel=True))
    return components


def find(components, component_id):
    for component in components:
        if component.id == component_id:
            return component
    return None
