import io
import json
import os
import sys

TESTS_DIR = os.path.dirname(os.path.abspath(__file__))
MOD_DIR = os.path.dirname(TESTS_DIR)
SRC_DIR = os.path.join(MOD_DIR, 'src')
CONTRACT_DIR = os.path.join(MOD_DIR, 'contract')

if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)


def load_json(path):
    with io.open(path, 'r', encoding='utf-8') as handle:
        return json.load(handle)


def fixture(name):
    return load_json(os.path.join(TESTS_DIR, 'fixtures', name))


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
