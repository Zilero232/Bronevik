from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import class_icon, outcome_icon
from ....core.hud.widget import widget
from . import detail_mode, line_note
from .constants import KIND, OUTCOME_TONES

# Fair play: the player's own shots, their outcome (the hit markers), damage and the HP left after the player's own
# shot, as the target's marker shows it; class and max HP as the player panels show them.


def row(entry, targets, note=''):
    target = targets.get(entry['target']) or {}
    outcome = entry.get('outcome')
    return {
        'outcome': outcome,
        'icon': outcome_icon(outcome),
        'tone': OUTCOME_TONES.get(outcome, 'muted'),
        'damage': entry.get('damage'),
        'crits': entry.get('crits') or 0,
        'hits': entry.get('hits', 1),
        'cls': class_icon(target.get('class'), 'red'),
        'name': entry.get('vehicle') or '',
        'hp': entry.get('hp'),
        'max': target.get('max'),
        'note': note,
    }


# `detail` is the row detail (model detail_mode): the page leaves the class and HP out of a short row and adds the
# `note` (shell and crits in words) to an extended one.
def hit_log_widget(log, settings, translate, extended=False):
    detail = detail_mode(settings, extended)
    grouped = settings.get('group_by_target')
    entries = log.by_target(settings.get('lines')) if grouped else log.recent(settings.get('lines'))
    values = log.values()
    header = {'hits': values['hits'], 'pens': values['pens'], 'damage': values['damage']} if settings.get('show_header') else None
    rows = [row(entry, log.targets, line_note(entry, translate, detail)) for entry in entries]
    return widget(KIND, {'header': header, 'grouped': bool(grouped), 'detail': detail, 'rows': rows})
