from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, font
from .constants import DETAIL_SIZE_STEP, MIN_DETAIL_SIZE, TEXT_COLORS


def _line(row, size):
    value = u' '.join(part for part in (row['value'], row['note']) if part)
    color = row['color'] or TEXT_COLORS[row['tone']]
    return u'%s %s' % (font(row['text'], COLOR_MUTED, size), font(value, color, size))


def format_panel(rows, settings):
    if not rows:
        return None
    size = settings.get('font_size')
    detail_size = max(MIN_DETAIL_SIZE, size - DETAIL_SIZE_STEP)

    lines = []
    for row in rows:
        lines.append(_line(row, size))
        if row['detail']:
            lines.append(font(row['detail'], COLOR_MUTED, detail_size))
    return u'\n'.join(lines)
