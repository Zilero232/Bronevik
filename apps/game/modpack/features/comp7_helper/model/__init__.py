# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, string_types, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, COLOR_UP, counted, font, format_number
from .constants import DIVISION_LETTERS, LEGEND_RANK, MAX_SKILL, RANK_IDS, THRESHOLD_RANKS, TITLE_SIZE_STEP

# Fair play: only what the Onslaught hangar already shows the player: their own rating, their division, the division
# ranges of the client's rank tooltips and the role skill chosen for the selected vehicle. Nothing about other players.


def _int(value, low=None):
    if not is_int(value) or isinstance(value, bool):
        return None
    return value if low is None or value >= low else None


def clean_division(item):
    if not isinstance(item, dict):
        return None
    rank, index, begin = _int(item.get('rank')), _int(item.get('index')), _int(item.get('begin'), 0)
    if rank not in RANK_IDS or index not in DIVISION_LETTERS or begin is None:
        return None
    return {'rank': rank, 'index': index, 'begin': begin, 'elite_percent': _int(item.get('elite_percent'), 0) or 0}


def division_key(step):
    return step['rank'], -step['index']


def _skill(value):
    if not isinstance(value, string_types):
        return None
    return to_text(value).strip()[:MAX_SKILL] or None


def clean_state(raw):
    """The Onslaught reads (`client/reads.py`) checked and ordered, or None outside the Onslaught hangar."""
    if not isinstance(raw, dict):
        return None
    divisions = [clean_division(item) for item in raw.get('divisions') or ()]
    return {
        'rating': _int(raw.get('rating'), 0) or 0,
        'division': clean_division(raw.get('division')),
        'divisions': sorted((step for step in divisions if step), key=division_key),
        'qualification': bool(raw.get('qualification')),
        'skill': _skill(raw.get('skill')),
    }


def division_name(step, translate):
    return u'%s %s' % (translate('comp7_helper_rank_%d' % step['rank']), DIVISION_LETTERS[step['index']])


def next_division(state):
    current = state['division']
    if current is None or state['qualification']:
        return None
    for step in state['divisions']:
        if division_key(step) > division_key(current):
            return step
    return None


def progress(state):
    """(the next division, points left to its lower bound, the share of the way there from the current one) or None."""
    current, target = state['division'], next_division(state)
    if target is None:
        return None
    left = max(0, target['begin'] - state['rating'])
    span = target['begin'] - current['begin']
    share = 1.0 if span <= 0 else max(0.0, min(1.0, float(state['rating'] - current['begin']) / span))
    return target, left, share


def threshold_status(step, state):
    current = state['division']
    if current is None or state['qualification']:
        return 'idle'
    if division_key(step) == division_key(current):
        return 'active'
    return 'done' if division_key(step) < division_key(current) else 'idle'


def thresholds(state):
    """The Champion and Legend divisions, lowest first: [(division, status)]."""
    return [(step, threshold_status(step, state)) for step in state['divisions'] if step['rank'] in THRESHOLD_RANKS]


def threshold_value(step, translate):
    value = translate('comp7_helper_from', points=format_number(step['begin']))
    if step['rank'] == LEGEND_RANK and step['elite_percent']:
        return u'%s · %s' % (value, translate('comp7_helper_top', percent=step['elite_percent']))
    return value


def next_text(state, translate):
    """What the player reaches next, or None (qualification, no division, the top one)."""
    found = progress(state)
    if found is None:
        return None
    target, left, _ = found
    if state['division']['rank'] == LEGEND_RANK:
        return translate('comp7_helper_next_legend', name=division_name(target, translate))
    return translate('comp7_helper_next', name=division_name(target, translate), points=counted(left, 'points', translate))


def status_text(state, translate):
    if state['qualification'] or state['division'] is None:
        return translate('comp7_helper_qualification')
    return division_name(state['division'], translate)


def format_hangar(state, settings, translate):
    if state is None:
        return None
    size = settings.get('font_size')
    title = translate('comp7_helper_title', status=status_text(state, translate), points=counted(state['rating'], 'points', translate))
    lines = [font(title, COLOR_NEUTRAL, size + TITLE_SIZE_STEP)]
    upcoming = next_text(state, translate)
    if upcoming:
        lines.append(font(upcoming, COLOR_UP, size))
    if settings.get('show_thresholds'):
        for step, status in thresholds(state):
            line = u'%s: %s' % (division_name(step, translate), threshold_value(step, translate))
            lines.append(font(line, COLOR_UP if status != 'idle' else COLOR_MUTED, size))
    if settings.get('show_skill') and state['skill']:
        lines.append(font(translate('comp7_helper_skill_line', skill=state['skill']), COLOR_MUTED, size))
    return u'\n'.join(lines)
