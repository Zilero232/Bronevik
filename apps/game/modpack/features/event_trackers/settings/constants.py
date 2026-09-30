from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'hangar_event_trackers'
SECTION = 'event_trackers'
GROUP = 'hangar'

# `triathlon_shown`: `event` while the client lists a clean-XP competition, `always` also outside it.
DEFAULTS = {
    'font_size': 14,
    'show_triathlon': True,
    'triathlon_shown': 'event',
    'show_caravan': True,
}
CHOICES = {'triathlon_shown': ('event', 'always')}
LIMITS = {'font_size': (8, 32)}
