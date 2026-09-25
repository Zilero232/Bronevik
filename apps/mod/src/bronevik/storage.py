import io
import json
import os

from .compat import to_bytes
from .jsonutil import dumps, dumps_pretty


def _replace(src, dst):
    replace = getattr(os, 'replace', None)
    if replace is not None:
        replace(src, dst)
        return
    if os.path.exists(dst):
        os.remove(dst)
    os.rename(src, dst)


class JsonFile(object):

    def __init__(self, path, pretty=False):
        self.path = path
        self.pretty = pretty

    def read(self, default=None):
        try:
            with io.open(self.path, 'r', encoding='utf-8') as handle:
                return json.load(handle)
        except (IOError, OSError, ValueError):
            return default

    def write(self, data):
        directory = os.path.dirname(self.path)
        if directory and not os.path.isdir(directory):
            os.makedirs(directory)
        text = dumps_pretty(data) if self.pretty else dumps(data)
        temp_path = self.path + '.tmp'
        with io.open(temp_path, 'wb') as handle:
            handle.write(to_bytes(text))
        _replace(temp_path, self.path)

    def delete(self):
        if os.path.exists(self.path):
            os.remove(self.path)


class MemoryFile(object):

    def __init__(self, data=None):
        self.data = data

    def read(self, default=None):
        if self.data is None:
            return default
        return json.loads(dumps(self.data))

    def write(self, data):
        self.data = json.loads(dumps(data))

    def delete(self):
        self.data = None
