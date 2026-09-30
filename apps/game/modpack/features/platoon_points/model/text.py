from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font
from . import rules_of


def points_text(platoon, settings, translate):
    rows = platoon.rows(rules_of(settings), settings.get('show_platoon'))
    total = sum(row['points'] for row in rows)

    lines = [font(translate('platoon_points_total', points=total), COLOR_NEUTRAL)]
    for row in rows:
        line = translate('platoon_points_row', name=row['name'], points=row['points'], frags=row['frags'])
        lines.append(font(line, COLOR_MUTED))
    return u'\n'.join(lines)
