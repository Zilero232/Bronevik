from __future__ import absolute_import, division, print_function, unicode_literals

BAR_CHAR = '|'
# One bar per vehicle in arena order, the Battle Observer-style strip (same data as the totals).
STYLE_ICONS = 'icons'
STRIP_STYLES = ('icons', 'segments')
COMPACT_STYLES = ('compact', 'minimal')

PREVIEW_TEAM = 1
PREVIEW_VEHICLES = (
    (1, 1, 1800, 1200, True, 'mediumTank'),
    (2, 1, 1500, 0, False, 'lightTank'),
    (3, 1, 2000, 2000, True, 'heavyTank'),
    (4, 2, 1700, 900, True, 'AT-SPG'),
    (5, 2, 1600, 0, False, 'mediumTank'),
    (6, 2, 1900, 0, False, 'SPG'),
)
PREVIEW_SIZE = (300, 60)

KIND = 'team_hp'
