# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, string_types, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, font, single_spaces, strip_tags
from .constants import MARK_OF, MAX_MISSIONS, MAX_TEXT, STATES, TITLE_SIZE_STEP

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
    return {
        'id': item.get('id'),
        'name': name,
        'main': clean_text(item.get('main')),
        'extra': clean_text(item.get('extra')),
        'state': item['state'],
        'classes': classes,
        'levels': clean_levels(item.get('levels')),
    }


def clean_levels(value):
    if not isinstance(value, (list, tuple)) or len(value) != 2:
        return None
    if not all(is_int(level) and level > 0 for level in value):
        return None
    return [min(value), max(value)]


def fits_level(mission, vehicle_level):
    levels = mission.get('levels')
    if vehicle_level is None or levels is None:
        return True
    return levels[0] <= vehicle_level <= levels[1]


def fits_class(mission, vehicle_class):
    if vehicle_class is None or not mission['classes']:
        return True
    return vehicle_class in mission['classes']


def by_state(missions):
    order = dict((state, index) for index, state in enumerate(STATES))
    return sorted(missions, key=lambda item: order[item['state']])


# The client lists the finished missions of every campaign too: the cap keeps the ones in progress, the totals count
# all.
def clean_missions(items):
    cleaned = [mission for mission in map(clean_mission, list(items or [])) if mission is not None]
    missions = by_state(cleaned)
    return missions[:MAX_MISSIONS], counts(missions)


def in_progress(missions, vehicle_class=None, vehicle_level=None):
    return [
        mission for mission in missions
        if mission['state'] == 'in_progress'
        and fits_class(mission, vehicle_class)
        and fits_level(mission, vehicle_level)
    ]


def shown_missions(missions, settings, vehicle_class=None, vehicle_level=None):
    return in_progress(missions, vehicle_class, vehicle_level)[:settings.get('max_missions')]


def counts(missions):
    states = [mission['state'] for mission in missions]
    return {
        'active': states.count('in_progress'),
        'done': states.count('done') + states.count('honors'),
        'honors': states.count('honors'),
    }


def mission_lines(mission, settings, translate, size):
    lines = [font(mission['name'], COLOR_NEUTRAL, size)]
    if not settings.get('show_conditions'):
        return lines
    if mission['main']:
        lines.append(font(translate('pm_main', condition=mission['main']), COLOR_MUTED, size))
    if mission['extra']:
        lines.append(font(translate('pm_extra', condition=mission['extra']), COLOR_MUTED, size))
    return lines


def format_hangar(missions, settings, translate, totals=None):
    if not missions:
        return None
    shown = shown_missions(missions, settings)
    size = settings.get('font_size')
    title = translate('pm_title', **(totals or counts(missions)))

    lines = [font(title, COLOR_NEUTRAL, size + TITLE_SIZE_STEP)]
    for mission in shown:
        lines.extend(mission_lines(mission, settings, translate, size))
    if not shown:
        lines.append(font(translate('pm_none_active'), COLOR_UP, size))
    return u'\n'.join(lines)


def format_battle(missions, vehicle_class, settings, translate, vehicle_level=None):
    shown = shown_missions(missions, settings, vehicle_class, vehicle_level)
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
    return {
        'id': to_text(mission['id']),
        'title': mission['name'],
        'subtitle': translate('pm_state_' + mission['state']),
        'badge': MARK_OF.get(mission['state']),
        'details': details,
        'actions': [],
    }


def build_page(missions, translate):
    rows = [mission_row(mission, translate) for mission in by_state(missions)]
    return {'kind': 'list', 'empty': translate('pm_empty'), 'rows': rows}
