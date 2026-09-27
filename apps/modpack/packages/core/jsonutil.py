import json

from .compat import to_bytes, to_text


def dumps(obj):
    return json.dumps(obj, sort_keys=True, separators=(',', ':'), ensure_ascii=True)


def dumps_bytes(obj):
    return to_bytes(dumps(obj))


def dumps_pretty(obj):
    return json.dumps(obj, sort_keys=True, indent=2, ensure_ascii=False)


def loads(data):
    return json.loads(to_text(data))
