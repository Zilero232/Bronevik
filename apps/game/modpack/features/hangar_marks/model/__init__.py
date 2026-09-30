from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, counted, font
from ....core.moe import moe_color, moe_macros, moe_state, rating_to_percent
from ....core.templates import render
from .constants import LINE_SEPARATOR, STEP_PERCENT, TARGET_SEPARATOR, TITLE_SIZE_STEP

__all__ = ('format_panel', 'hangar_state', 'target_levels')


def hangar_state(snapshot, curve, pace):
    return moe_state(
        snapshot['moving_avg_damage'],
        rating_to_percent(snapshot.get('damage_rating')),
        None,
        curve,
        pace,
        STEP_PERCENT,
        snapshot.get('marks_on_gun'),
    )


def target_levels(state):
    shows_hundred = state['next_level'] == 100
    return [level for level in sorted(state['need']) if level != 100 or shows_hundred]


def _targets_text(state, values, translate):
    template = translate('hangar_marks_line_target')
    items = []
    for level in target_levels(state):
        items.append(render(template, {'level': u'%d' % level, 'need': values['need%d' % level]}))
    return TARGET_SEPARATOR.join(items)


def _panel_values(state, translate):
    values = moe_macros(state)
    values['title'] = translate('hangar_marks_title')
    if state['battles'] is not None:
        values['battles_count'] = counted(state['battles'], 'battles', translate)
    else:
        values['battles_count'] = values['battles']
    return values


def _extended_lines(state, settings, translate, values, color):
    size = settings.get('font_size')
    lines = [
        font(render(translate('hangar_marks_line_head'), values), color, size + TITLE_SIZE_STEP),
        font(render(translate('hangar_marks_line_average'), values), COLOR_NEUTRAL, size),
    ]
    if not state['has_curve']:
        lines.append(font(translate('hangar_marks_no_curve'), COLOR_MUTED, size))
        return lines

    if settings.get('show_targets') and state['need']:
        lines.append(font(_targets_text(state, values, translate), COLOR_NEUTRAL, size))
    if settings.get('show_forecast') and state['next_level'] is not None:
        lines.append(font(render(translate('hangar_marks_line_forecast'), values), COLOR_MUTED, size))
    return lines


def format_panel(state, settings, translate):
    values = _panel_values(state, translate)
    color = moe_color(state, settings.get('color_mode'))
    size = settings.get('font_size')
    style = settings.get('style')
    template = settings.get('template')

    if style == 'custom' and template:
        return font(render(template, values), color, size)
    if style == 'compact':
        return font(render(translate('hangar_marks_line_compact'), values), color, size)
    return LINE_SEPARATOR.join(_extended_lines(state, settings, translate, values, color))
