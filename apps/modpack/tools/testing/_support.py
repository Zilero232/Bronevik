"""Shared test helpers. Importing it maps the repo layout onto the in-game package tree:

    packages/core       -> otmetki.core       (gui/mods/otmetki/core in the client)
    packages/companion  -> otmetki.companion
    features/<id>       -> otmetki.features.<id>

so tests import the sources exactly as the client does, with their relative imports intact.
"""
import io
import json
import os
import sys
import types

TESTING_DIR = os.path.dirname(os.path.abspath(__file__))
MODPACK_DIR = os.path.dirname(os.path.dirname(TESTING_DIR))
PACKAGES_DIR = os.path.join(MODPACK_DIR, 'packages')
FEATURES_DIR = os.path.join(MODPACK_DIR, 'features')
CONTRACT_DIR = os.path.join(MODPACK_DIR, 'contract')
FIXTURES_DIR = os.path.join(PACKAGES_DIR, 'companion', 'tests', 'fixtures')
ROOT_PACKAGE = 'otmetki'


def _install_root_package():
    if ROOT_PACKAGE in sys.modules:
        return
    root = types.ModuleType(ROOT_PACKAGE)
    root.__path__ = [PACKAGES_DIR, MODPACK_DIR]
    sys.modules[ROOT_PACKAGE] = root


_install_root_package()


def source_dirs():
    """Every directory of game-client sources: core, companion and each feature."""
    dirs = [os.path.join(PACKAGES_DIR, name) for name in sorted(os.listdir(PACKAGES_DIR))]
    dirs += [os.path.join(FEATURES_DIR, name) for name in sorted(os.listdir(FEATURES_DIR))]
    return [path for path in dirs if os.path.isdir(path) and not os.path.basename(path).startswith(('_', '.'))]


def feature_ids():
    return [os.path.basename(path) for path in source_dirs() if os.path.dirname(path) == FEATURES_DIR]


def source_files():
    """Game-client .py sources (tests excluded), the entry scripts and features/__init__.py included."""
    yield os.path.join(FEATURES_DIR, '__init__.py')
    for base in source_dirs():
        for directory, dirs, files in os.walk(base):
            dirs[:] = sorted(d for d in dirs if d not in ('tests', '__pycache__'))
            for name in sorted(files):
                if name.endswith('.py'):
                    yield os.path.join(directory, name)


def load_json(path):
    with io.open(path, 'r', encoding='utf-8') as handle:
        return json.load(handle)


def fixture(name):
    return load_json(os.path.join(FIXTURES_DIR, name))


def battle_results():
    data = fixture('battle_results_random.json')
    personal = data['personal']
    for key in list(personal.keys()):
        if key != 'avatar':
            personal[int(key)] = personal.pop(key)
    return data


def schema(name):
    return load_json(os.path.join(CONTRACT_DIR, name))


def schema_validator(name, definition=None):
    try:
        import jsonschema
    except ImportError:
        return None
    root = schema(name)
    target = root if definition is None else dict(root['definitions'][definition], definitions=root['definitions'])
    return jsonschema.Draft7Validator(target)


class FakeTransport(object):

    def __init__(self):
        self.requests = []

    def request(self, method, url, headers, body, callback):
        self.requests.append({'method': method, 'url': url, 'headers': headers, 'body': body, 'callback': callback})

    def respond(self, status, body=b'', headers=None, index=-1):
        request = self.requests[index]
        request['callback'](status, body, headers or {})

    def poll(self):
        return 0
