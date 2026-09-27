from __future__ import absolute_import, division, print_function, unicode_literals

import os
import re

from ....core.compat import string_types, to_text
from .constants import ERROR_NAME, NAME_MAX_CHARS
from .errors import ReplayActionError

_FORBIDDEN = re.compile(r'[<>:"/\\|?*\x00-\x1f]+')
_SPACES = re.compile(r'\s+')
_RESERVED = ('con', 'prn', 'aux', 'nul') + tuple('com%d' % n for n in range(1, 10)) + tuple('lpt%d' % n for n in range(1, 10))


def rename_target(old_name, title):
    """The new file name for `title`: Windows-safe, no folders, same extension as `old_name`."""
    if not isinstance(title, string_types):
        raise ReplayActionError(ERROR_NAME)
    extension = os.path.splitext(to_text(old_name))[1]
    stem = _SPACES.sub(' ', _FORBIDDEN.sub(' ', to_text(title))).strip().strip('.')
    if stem.lower().endswith(extension.lower()):
        stem = stem[:-len(extension)].strip()
    stem = stem[:NAME_MAX_CHARS].strip()
    if not stem or stem.lower() in _RESERVED:
        raise ReplayActionError(ERROR_NAME)
    return stem + extension
