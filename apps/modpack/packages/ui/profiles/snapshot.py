from __future__ import absolute_import, division, print_function, unicode_literals

import copy

from .constants import EXCLUDED_CONFIG_KEYS


def take_snapshot(config, component_config=None):
    """The settings a profile carries: config.json without the connection and one-shot keys, and every
    components.json section (sections of components that are not installed included)."""
    values = dict((key, value) for key, value in config.to_dict().items() if key not in EXCLUDED_CONFIG_KEYS)
    sections = copy.deepcopy(component_config.data) if component_config is not None else {}
    return {'config': values, 'components': sections}


def apply_snapshot(snapshot, config, save_config, component_config=None, layer=None):
    """Applies a profile. Returns {component id or 'config': changed keys}. A section of a component
    that is not installed is stored as is and merged through its schema once the component registers."""
    changes = {}
    values = dict((key, value) for key, value in (snapshot.get('config') or {}).items() if key not in EXCLUDED_CONFIG_KEYS)
    changed = config.update(values)
    if changed:
        save_config()
        changes['config'] = changed
    if component_config is None:
        return changes
    stored_raw = False
    panels = getattr(layer, 'panels', {}) if layer is not None else {}
    for key, section in sorted((snapshot.get('components') or {}).items()):
        if not isinstance(section, dict):
            continue
        if component_config.get(key) is None:
            component_config.data[key] = copy.deepcopy(section)
            stored_raw = True
            continue
        if key in panels:
            changed = layer.update_settings(key, section)
        else:
            changed = component_config.update(key, section)
        if changed:
            changes[key] = changed
    if stored_raw:
        component_config.save()
    return changes
