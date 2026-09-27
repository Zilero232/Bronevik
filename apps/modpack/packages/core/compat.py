import sys

PY2 = sys.version_info[0] == 2

if PY2:
    text_type = unicode  # noqa: F821
    binary_type = str
    string_types = (str, unicode)  # noqa: F821
    integer_types = (int, long)  # noqa: F821  # novermin
else:
    text_type = str
    binary_type = bytes
    string_types = (str,)
    integer_types = (int,)


def to_bytes(value, encoding='utf-8'):
    if isinstance(value, binary_type):
        return value
    if not isinstance(value, text_type):
        value = text_type(value)
    return value.encode(encoding)


def to_text(value, encoding='utf-8'):
    if isinstance(value, text_type):
        return value
    if isinstance(value, binary_type):
        return value.decode(encoding)
    return text_type(value)


def to_native(value, encoding='utf-8'):
    """The interpreter's `str`: bytes on Python 2 (httplib must not mix unicode headers with a binary body)."""
    return to_bytes(value, encoding) if PY2 else to_text(value, encoding)


def is_int(value):
    return isinstance(value, integer_types) and not isinstance(value, bool)


def is_number(value):
    return is_int(value) or isinstance(value, float)
