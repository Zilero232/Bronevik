from __future__ import absolute_import, division, print_function, unicode_literals

import os

from .constants import ACTION_BACKUP, ACTION_RESTORE, ACTIONS  # noqa: F401


def is_config_file(path, config_dir):
    """Whether a saved file lies directly in the mod's config folder (the durable copy in %APPDATA% does not)."""
    if not path or not config_dir:
        return False
    folder = os.path.normcase(os.path.abspath(os.path.dirname(path)))
    return folder == os.path.normcase(os.path.abspath(config_dir))


def restored_notice(names):
    """The i18n key and its parameters of the message after a restore, or None when nothing came back."""
    if not names:
        return None
    return 'config_backup_restored', {'count': len(names), 'files': ', '.join(names)}
