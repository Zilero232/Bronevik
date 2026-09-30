"""Config backup: a copy of the settings files of `mods/configs/otmetki` beside the client's preferences.xml.

A modpack installer may wipe `mods/configs`; `core.durable` keeps the five files a player cannot recreate in the
TriOtmetki folder of %APPDATA%, this keeps every settings file (a component's own data included) next to the client's
profile.
`mirror_file` copies one file after it was saved, `mirror_all` brings the whole backup up to date, and
`restore_missing` copies back only the files missing from the game folder, so a later save is never overwritten.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import shutil

from ..storage import replace_file
from .constants import BACKED_UP_SUFFIX, BACKUP_DIR_NAME, MTIME_TOLERANCE_S, SKIPPED_PREFIXES, TEMP_SUFFIX

__all__ = ('backup_dir', 'is_backed_up', 'mirror_all', 'mirror_file', 'restore_missing')


def backup_dir(preferences_path):
    """The backup folder beside the client's preferences file, or None when the path is unknown."""
    if not preferences_path:
        return None
    folder = os.path.dirname(preferences_path)
    return os.path.join(folder, BACKUP_DIR_NAME) if folder else None


def is_backed_up(name):
    """Whether a file of the config folder belongs in the backup: the settings JSON, not the send queues."""
    return name.endswith(BACKED_UP_SUFFIX) and not name.startswith(SKIPPED_PREFIXES)


def _names(directory):
    try:
        entries = os.listdir(directory)
    except (IOError, OSError):
        return []
    return sorted(name for name in entries if is_backed_up(name) and os.path.isfile(os.path.join(directory, name)))


def _stat(path):
    try:
        found = os.stat(path)
    except (IOError, OSError):
        return None
    return found.st_size, found.st_mtime


def _is_same(source, target):
    first, second = _stat(source), _stat(target)
    if first is None or second is None:
        return False
    return first[0] == second[0] and abs(first[1] - second[1]) <= MTIME_TOLERANCE_S


def _copy(source, target):
    folder = os.path.dirname(target)
    if not os.path.isdir(folder):
        os.makedirs(folder)
    temp = target + TEMP_SUFFIX
    shutil.copy2(source, temp)
    replace_file(temp, target)


def mirror_file(config_dir, target_dir, name):
    """Copy `config_dir/name` into `target_dir` unless it is not backed up, missing or already the same there."""
    source = os.path.join(config_dir, name)
    target = os.path.join(target_dir, name)
    if not is_backed_up(name) or not os.path.isfile(source) or _is_same(source, target):
        return False
    _copy(source, target)
    return True


def mirror_all(config_dir, target_dir):
    """Copy every changed settings file of `config_dir` into `target_dir`; the names copied."""
    return [name for name in _names(config_dir) if mirror_file(config_dir, target_dir, name)]


def restore_missing(config_dir, target_dir):
    """Copy back from `target_dir` the settings files `config_dir` no longer has; the names restored."""
    restored = []
    for name in _names(target_dir):
        if not os.path.exists(os.path.join(config_dir, name)):
            _copy(os.path.join(target_dir, name), os.path.join(config_dir, name))
            restored.append(name)
    return restored
