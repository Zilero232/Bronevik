# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import string_types, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, single_spaces, strip_tags
from .constants import DONE_MARK, HONORS_MARK, MAX_MISSIONS, MAX_TEXT, STATES, TITLE_SIZE_STEP

# Fair play: the player's own personal missions as the client's missions screen holds them (names, conditions, the
# own progress state). Nothing about other players; in battle only the snapshot taken in the hangar is shown.


def clean_text(value):
    if not isinstance(value, string_types) or not value:
        return u''
    return single_spaces(strip_tags(to_text(value), u' '))[:MAX_TEXT]


def clean_mission(item):
    if not isinstance(item, dict) or item.get('state') not in STATES:
        return None
    name = clean_text(item.get('name'))
    if not name:
        return None
    classes = [to_text(tag) for tag in (item.get('classes') or []) if isinstance(tag, string_types)]
    return {'id': item.get('id'), 'name': name, 'main': clean_text(item.get('main')), 'extra': clean_text(item.get('extra')),
            'state': item['state'], 'classes': classes}


def by_state(missions):
    order = dict((state, index) for index, state in enumerate(STATES))
    return sorted(missions, key=lambda item: order[item['state']])


# The client lists the finished missions of every campaign too: the cap keeps the ones in progress, the totals count all.
def clean_missions(items):
    missions = by_state([mission for mission in (clean_mission(item) for item in list(items or [])) if mission is not None])
    return missions[:MAX_MISSIONS], counts(missions)


def in_progress(missions, vehicle_class=None):
    """The missions in progress, those of `vehicle_class` (or of every class) when it is given."""
    return [mission for mission in missions if mission['state'] == 'in_progress'
            and (vehicle_class is None or not mission['classes'] or vehicle_class in mission['classes'])]


def counts(missions):
    return {
        'active': len([mission for mission in missions if mission['state'] == 'in_progress']),
        'done': len([mission for mission in missions if mission['state'] in ('done', 'honors')]),
        'honors': len([mission for mission in missions if mission['state'] == 'honors']),
    }


def mission_lines(mission, settings, translate, size):
    lines = [font(mission['name'], COLOR_NEUTRAL, size)]
    if settings.get('show_conditions'):
        if mission['main']:
            lines.append(font(translate('pm_main', condition=mission['main']), COLOR_MUTED, size))
        if mission['extra']:
            lines.append(font(translate('pm_extra', condition=mission['extra']), COLOR_MUTED, size))
    return lines


def mark_of(mission):
    return HONORS_MARK if mission['state'] == 'honors' else DONE_MARK if mission['state'] == 'done' else u''


def format_hangar(missions, settings, translate, totals=None):
    shown = in_progress(missions)[:settings.get('max_missions')]
    if not missions:
        return None
    size = settings.get('font_size')
    lines = [font(translate('pm_title', **(totals or counts(missions))), COLOR_NEUTRAL, size + TITLE_SIZE_STEP)]
    for mission in shown:
        lines.extend(mission_lines(mission, settings, translate, size))
    if not shown:
        lines.append(font(translate('pm_none_active'), COLOR_UP, size))
    return u'\n'.join(lines)


def format_battle(missions, vehicle_class, settings, translate):
    shown = in_progress(missions, vehicle_class)[:settings.get('max_missions')]
    if not shown:
        return None
    size = settings.get('font_size')
    lines = []
    for mission in shown:
        lines.extend(mission_lines(mission, settings, translate, size))
    return u'\n'.join(lines)


def mission_row(mission, translate):
    details = []
    if mission['main']:
        details.append({'label': translate('pm_main_label'), 'value': mission['main']})
    if mission['extra']:
        details.append({'label': translate('pm_extra_label'), 'value': mission['extra']})
    mark = mark_of(mission)
    return {'id': to_text(mission['id']), 'title': mission['name'], 'subtitle': translate('pm_state_' + mission['state']),
            'badge': mark or None, 'details': details, 'actions': []}


def build_page(missions, translate):
    """The window page: every mission the client listed, the ones in progress first."""
    rows = [mission_row(mission, translate) for mission in by_state(missions)]
    return {'kind': 'list', 'empty': translate('pm_empty'), 'rows': rows}
