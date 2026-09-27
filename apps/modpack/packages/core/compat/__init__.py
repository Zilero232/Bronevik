"""Python 2/3 helpers on top of the vendored `six`.

The type aliases are six's; `to_text` / `to_bytes` / `to_native` are six's `ensure_*` that also take a
non-string (a number, None) by converting it to text first, which is what the mod's callers rely on.
"""
from ..vendor import six

PY2 = six.PY2
text_type = six.text_type
binary_type = six.binary_type
string_types = six.string_types
integer_types = six.integer_types


def _string(value):
    return value if isinstance(value, (six.text_type, six.binary_type)) else six.text_type(value)


def to_bytes(value, encoding='utf-8'):
    return six.ensure_binary(_string(value), encoding)


def to_text(value, encoding='utf-8'):
    return six.ensure_text(_string(value), encoding)


def to_native(value, encoding='utf-8'):
    """The interpreter's `str`: bytes on Python 2 (httplib must not mix unicode headers with a binary body)."""
    return six.ensure_str(_string(value), encoding)


def is_int(value):
    return isinstance(value, six.integer_types) and not isinstance(value, bool)


def is_number(value):
    return is_int(value) or isinstance(value, float)


def as_int(value, default=0):
    """`value` as an int when it is a number (floats truncated), else `default`."""
    return int(value) if is_number(value) else default
