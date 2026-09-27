from __future__ import absolute_import, division, print_function, unicode_literals

import importlib  # novermin

from .catalog import FeatureInfo


def _import(name):
    try:
        return importlib.import_module(name)
    except ImportError:
        return None


def load_features(root_package, instances, skip=()):
    """FeatureInfo of every attached feature (registry instances), in id order, with its settings module
    `<root>.features.<id>.settings` and its package's PACKAGE_NAME as the fallback title."""
    features = []
    for feature_id in sorted(instances):
        if feature_id in skip:
            continue
        base = '%s.features.%s' % (root_package, feature_id)
        package = _import(base)
        features.append(FeatureInfo(feature_id, _import(base + '.settings'), instances[feature_id],
                                    getattr(package, 'PACKAGE_NAME', None)))
    return features


def root_package(module_name, marker='.ui.'):
    """`gui.mods.otmetki` in the client, `otmetki` in the tests: the part of a ui module name before `.ui.`."""
    return module_name.split(marker, 1)[0]
