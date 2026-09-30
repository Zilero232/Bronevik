from __future__ import absolute_import, division, print_function, unicode_literals

import importlib  # novermin
import os

from ....core.durable import open_config
from ....core.log import log
from ....core.storage import JsonFile
from ..constants import COMPONENTS_BACKUP, COMPONENTS_FILE, FEATURES_PACKAGE
from ..migrate import migrated


_ROOT_PACKAGE = __name__.rsplit('.companion.', 1)[0]


def _schema_defaults(section):
    try:
        settings = importlib.import_module('%s.%s.%s.settings' % (_ROOT_PACKAGE, FEATURES_PACKAGE, section))
    except ImportError:
        return None
    schema = getattr(settings, 'SCHEMA', None)
    return getattr(schema, 'defaults', None)


def migrate_stored(config_dir, stored_config):
    """The stored config.json moved to the current revision, with components.json migrated alongside (the file before
    the change is kept next to it as COMPONENTS_BACKUP)."""
    components_file = open_config(config_dir, COMPONENTS_FILE, pretty=True)
    components = components_file.read({})
    config, migrated_components = migrated(stored_config, components, _schema_defaults)
    if migrated_components != components:
        JsonFile(os.path.join(config_dir, COMPONENTS_BACKUP), pretty=True).write(components)
        components_file.write(migrated_components)
        log('components.json moved to the merged components')
    return config
