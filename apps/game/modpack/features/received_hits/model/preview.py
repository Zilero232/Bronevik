from __future__ import absolute_import, division, print_function, unicode_literals

from . import ReceivedHits, format_panel
from .constants import PREVIEW_HITS
from .widget import panel_widget


def preview_hits():
    hits = ReceivedHits()
    for index, (attacker, vehicle_class, shell, outcome, damage, crits) in enumerate(PREVIEW_HITS):
        hits.add(outcome, attacker, vehicle_class, shell, damage, crits, index * 10.0)
    return hits


def preview_text(settings, translate):
    return format_panel(preview_hits(), settings, translate) or u''


def preview_widget(settings, translate):
    return panel_widget(preview_hits(), settings, translate)
