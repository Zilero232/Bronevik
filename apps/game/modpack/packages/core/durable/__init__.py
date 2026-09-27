"""Durable settings: a copy of the files a player cannot recreate, kept outside the game folder.

MOST (Lesta's mod installer) may delete `mods/configs` (docs/ops/most-publishing.md), which holds the binding, config.json,
components.json, profiles.json and state.json. `open_config` hands out a `MirroredFile` for those: every
write goes to `mods/configs/otmetki/<name>` and to `%APPDATA%\\TriOtmetki\\<name>` with one saved-at stamp,
and every read first restores the game-folder copy when it is missing, unreadable or older than the
durable one. The newer copy always wins, so neither side loses a later save. README "Durable settings"
documents the layout the manager app reads.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import time

from ..storage import JsonFile
from .constants import DURABLE_FILES, SECRET_FILES, SECRET_MODE, STAMP_TOLERANCE_S
from .paths import durable_dir, to_path_text  # noqa: F401
from .stamps import Stamps, file_mtime, touch

_MISSING = object()


class _Copy(object):

    def __init__(self, directory, name, pretty):
        self.name = name
        self.path = os.path.join(directory, name)
        self.file = JsonFile(self.path, pretty=pretty)
        self.stamps = Stamps(directory)

    def read(self):
        return self.file.read(_MISSING)

    def stamp(self):
        stamps = [value for value in (self.stamps.get(self.name), file_mtime(self.path)) if value is not None]
        return max(stamps) if stamps else 0.0

    def write(self, data, stamp, secret):
        self.file.write(data)
        touch(self.path, stamp)
        if secret:
            restrict(self.path)
        self.stamps.set(self.name, stamp)

    def delete(self):
        self.file.delete()
        self.stamps.set(self.name, None)


def restrict(path):
    """Owner-only permissions where the platform has them; on Windows the per-user %APPDATA% ACL is what protects it."""
    try:
        os.chmod(path, SECRET_MODE)
    except (IOError, OSError):
        pass


class MirroredFile(object):
    """A `JsonFile` stand-in kept in two folders; `mirror_error` holds the last failure of the durable side,
    which never fails a save of the game-folder copy."""

    def __init__(self, primary_dir, mirror_dir, name, pretty=False, clock=time.time):
        self.primary = _Copy(primary_dir, name, pretty)
        self.mirror = _Copy(mirror_dir, name, pretty)
        self.path = self.primary.path
        self.clock = clock
        self.secret = name in SECRET_FILES
        self.mirror_error = None

    def read(self, default=None):
        data = self.sync()
        return default if data is _MISSING else data

    def sync(self):
        """Bring both copies to the newer one; returns its data (or the missing marker)."""
        primary = self.primary.read()
        mirror = self._mirror(self.mirror.read, _MISSING)
        if primary is _MISSING and mirror is _MISSING:
            return _MISSING
        if primary is _MISSING or (mirror is not _MISSING and self._mirror_newer()):
            try:
                self.primary.write(mirror, self.mirror.stamp(), self.secret)
            except (IOError, OSError):
                pass
            return mirror
        if mirror is _MISSING or self.primary.stamp() > self.mirror.stamp() + STAMP_TOLERANCE_S:
            stamp = self.primary.stamp()
            self._mirror(lambda: self.mirror.write(primary, stamp, self.secret))
        return primary

    def write(self, data):
        stamp = self.clock()
        self.primary.write(data, stamp, self.secret)
        self._mirror(lambda: self.mirror.write(data, stamp, self.secret))

    def delete(self):
        self.primary.delete()
        self._mirror(self.mirror.delete)

    def _mirror_newer(self):
        return self.mirror.stamp() > self.primary.stamp() + STAMP_TOLERANCE_S

    def _mirror(self, action, fallback=None):
        try:
            result = action()
        except (IOError, OSError) as error:
            self.mirror_error = error
            return fallback
        self.mirror_error = None
        return result


def open_config(config_dir, name, pretty=False, mirror_dir=_MISSING, clock=time.time):
    """The storage of `mods/configs/otmetki/<name>`: a `MirroredFile` for the `DURABLE_FILES` when the
    durable folder is known, else a plain `JsonFile`."""
    mirror_dir = durable_dir() if mirror_dir is _MISSING else mirror_dir
    if name in DURABLE_FILES and mirror_dir and os.path.normcase(os.path.abspath(mirror_dir)) != os.path.normcase(os.path.abspath(config_dir)):
        return MirroredFile(config_dir, mirror_dir, name, pretty, clock)
    return JsonFile(os.path.join(config_dir, name), pretty=pretty)
