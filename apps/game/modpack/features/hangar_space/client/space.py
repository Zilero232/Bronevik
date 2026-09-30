from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.game import client_attr, service
from ..model import space_name
from .constants import (
    CONTROLLER_SKELETON,
    DEFAULT_CONFIG_ATTR,
    DEFAULT_SCENE,
    HANGAR_CONFIGS,
    HANGAR_SPACE_SKELETON,
    OVERRIDES_ATTR,
)


def controller():
    return service(client_attr(*CONTROLLER_SKELETON))


def available_paths():
    configs = client_attr(*HANGAR_CONFIGS)
    return list(configs.keys()) if isinstance(configs, dict) else []


def current_name():
    hangar = service(client_attr(*HANGAR_SPACE_SKELETON))
    return space_name(getattr(hangar, 'spacePath', None))


def is_default_scene(switcher):
    return getattr(switcher, 'currentSceneName', None) == client_attr(*DEFAULT_SCENE)


def overrides(switcher):
    config = getattr(switcher, DEFAULT_CONFIG_ATTR, None)
    return dict(getattr(config, OVERRIDES_ATTR, None) or {})


def write_overrides(switcher, changes):
    config = getattr(switcher, DEFAULT_CONFIG_ATTR)
    for is_premium, path in changes.items():
        if path is None:
            config.discardSpaceIdOverride(is_premium)
        else:
            config.setSpaceIdOverride(is_premium, path)
