from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import to_text
from .constants import SPACES, TAGS


def font(text, color, size=None):
    """`text` in a GUIFlash `<font>` tag (the HTML subset the panels render)."""
    if size:
        return u'<font color="%s" size="%d">%s</font>' % (color, size, to_text(text))
    return u'<font color="%s">%s</font>' % (color, to_text(text))


def strip_tags(text, replacement=''):
    """`text` without the markup tags, each replaced by `replacement`."""
    return TAGS.sub(replacement, to_text(text))


def single_spaces(text):
    """`text` with every run of whitespace turned into one space, trimmed."""
    return SPACES.sub(' ', to_text(text)).strip()
