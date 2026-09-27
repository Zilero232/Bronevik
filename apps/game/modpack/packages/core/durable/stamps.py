from __future__ import absolute_import, division, print_function, unicode_literals

import os

from ..compat import is_number
from ..storage import JsonFile
from .constants import STAMPS_NAME, STAMPS_VERSION


class Stamps(object):
    """saved_at.json of one folder: {version, files: {name: unix seconds of the last save}}."""

    def __init__(self, directory):
        self.directory = directory
        self.file = JsonFile(os.path.join(directory, STAMPS_NAME), pretty=True)

    def _files(self):
        data = self.file.read({})
        files = data.get('files') if isinstance(data, dict) else None
        return dict(files) if isinstance(files, dict) else {}

    def get(self, name):
        value = self._files().get(name)
        return float(value) if is_number(value) else None

    def set(self, name, stamp):
        files = self._files()
        if stamp is None:
            files.pop(name, None)
        else:
            files[name] = stamp
        self.file.write({'version': STAMPS_VERSION, 'files': files})


def file_mtime(path):
    try:
        return os.path.getmtime(path)
    except (IOError, OSError):
        return None


def touch(path, stamp):
    try:
        os.utime(path, (stamp, stamp))
    except (IOError, OSError):
        pass
